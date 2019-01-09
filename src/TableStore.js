import * as Utils from './utils'

const MODE = {
  LOAD_ALL: 0,
  LOAD_BY_PAGE: 1
}

const Log = process.env['NODE_ENV'] === 'test' ? {
  warn: _ => {},
  error: _ => {},
  info: _ => {}
} : {
  warn: msg => {
    console.warn(
      `%c TabelStore %c %c[Warning]%c ${msg}`,
      'background-color: #03A9F4; color: #fff;',
      '',
      'color: #E6A23C',
      ''
    )
  },
  error: msg => {
    console.error(
      `%c TabelStore %c %c[Error]%c ${msg}`,
      'background-color: #03A9F4; color: #fff;',
      '',
      'color: #F56C6C',
      ''
    )
  },
  info: msg => {
    console.info(
      `%c TabelStore %c %c[Info]%c ${msg}`,
      'background-color: #03A9F4; color: #fff;',
      '',
      'color: #67C23A',
      ''
    )
  }
}

const SORT_MODE = {
  ASC: 'ASC',
  DESC: 'DESC'
}

class TableStore {
  constructor (params = {}) {
    this.mode = MODE.LOAD_ALL

    this.primaryKey = 'id'
    this.storeType = params.storeType
    this.storeName = params.storeName

    // fieldFilters
    this.initialFieldFilters = params.initialFieldFilters
    // filterText
    this.initialFilteringFields = params.initialFilteringFields
    this.initialFilterText = params.initialFilterText
    // sorting
    this.initialSortKey = params.initialSortKey
    this.initialSortDirection = params.initialSortDirection

    this.data = []
    this.fields = []
    this.totalCount = 0
    this.pageSize = 10

    // state
    this.loading = false
    this.currentPage = 0

    // fieldFilters
    this.fieldFilters = []
    // doFilterText
    this.filteringFields = []
    this.filterText = ''
    // sorting
    this.sorting = {
      sortkey: null,
      direction: SORT_MODE.ASC
    }

    this.isInitialed = false
    this.isFieldsFiltersChanged = false
    this.isFilterTextChanged = false
    this.isSortingChanged = false

    this._resultData = []

    this.initial(params)
  }

  get resultData () {
    this.reloadStore()
    this.resetChangeState()

    return this._resultData
  }

  set resultData (data) {
    Log.warn('suggest not to set "resultData" directly.')
    this.data = data
  }

  initial (params) {
    const defaultData = params.data || (this.data.length ? this.data : null)
    this.setData(defaultData)

    // if no have fields, can't sorting and filter
    if (params.fields || this.fields.length) {
      const defaultFields = params.fields || this.fields
      this.setFields(defaultFields)

      // fieldFilters
      const fieldFilters = params.initialFieldFilters
      // filterText
      const filteringFields = params.initialFilteringFields
      const filterText = params.initialFilterText
      // sorting
      const sortKey = params.initialSortKey
      const sortDirection = params.initialSortDirection

      this.setDefault({
        fieldFilters,
        filterText,
        filteringFields,
        sortKey,
        sortDirection
      })

      // set default current page
      // this.setCurrentPage(this.currentPage);
    }
  }

  setDefault (defaultValue = {
    // fieldFilters
    fieldFilters: this.initialFieldFilters || [],
    // filterText
    filteringFields: this.initialFilteringFields || this.getDefaultFilteringFields(),
    filterText: this.initialFilterText || '',
    // sorting
    sortKey: this.initialSortKey || this.getDefaultSortKey(),
    sortDirection: this.initialSortDirection || SORT_MODE.ASC
  }) {
    if (this.isInitialed) return null
    this.isInitialed = true

    // sorting
    this.setInitialSorting(defaultValue.sortKey, defaultValue.sortDirection)

    // filterText
    this.setInitialFilteringFields(defaultValue.filteringFields)
    !!defaultValue.filterText && this.setInitialFilterText(defaultValue.filterText)

    // fieldFilters
    this.setInitialFieldFilters(defaultValue.fieldFilters)
  }

  setInitialFieldFilters (filters) {
    this.setFieldFilters(filters)
  }

  setInitialFilterText (text) {
    this.setFilterText(text)
  }

  setInitialFilteringFields (fields) {
    if (fields && Array.isArray(fields)) {
      this.setFilteringFields(fields)
    }
  }

  setInitialSorting (sortKey, direction = SORT_MODE.ASC) {
    if (!sortKey) {
      Log.error('Initial "sortKey" need to provide.')
      return null
    }
    const isValidSortKey = this.isValidSortKey(sortKey)
    if (isValidSortKey) {
      this.sorting.sortkey = sortKey
      this.setSorting(sortKey, direction)
    } else {
      Log.error('Initial "sortKey" is inVaild.')
      return null
    }
  }

  setData (data) {
    if (this.isInitialed) {
      this.updateStore('data', data)
    } else if (data && Array.isArray(data)) {
      Log.info('setData')
      this.updateByData(data)
    }
  }

  getData () {
    return this.data
  }

  getResult () {
    return this.resultData
  }

  setFields (fields) {
    let fieldsResult = []
    if (fields instanceof Array) {
      fieldsResult = this.setFieldsFromArray(fields)
      Log.info('setFields')
    } else {
      Log.error(`argument "fields" should be Array! but get ${typeof (fields)} type.`)
    }

    if (fieldsResult.length !== 0) {
      if (this.isInitialed) {
        this.updateStore('fields', fieldsResult)
      } else {
        this.fields = fieldsResult

        this.setDefault()
      }
    }
  }

  getFields () {
    return this.fields
  }

  getFieldByKey (soryKey) {
    return this.fields.filter(field => field.id === soryKey)[0]
  }

  /**
     * set sorting
     * @param {String} sortkey
     * @param {String} direction
     */
  setSorting (sortkey, direction = SORT_MODE.ASC) {
    if (!sortkey || !this.isValidSortKey(sortkey)) {
      Log.error('"sortKey" is inVaild.')
      return null
    }
    let sorting = {}
    if (!this.isInitialed) {
      Log.error('set "Fields" first!')
    } else {
      Log.info(`set Sorting by "${sortkey}" "${direction}"`)
      sorting = {
        sortkey: sortkey,
        direction: direction
      }
    }
    this.updateStore('sorting', sorting)
    return this
  }

  setFilterText (filterText) {
    Log.info(`set filterText "${filterText}"`)
    this.updateStore('filterText', !filterText ? '' : Utils.getClearText(filterText))
    return this
  }

  setFieldFilters (filters) {
    if (!Array.isArray(filters)) {
      Log.error(`"fieldFilters" is empty or inValid!`)
      return null
    }
    Log.info(`set fieldFilters "${filters}"`)
    this.updateStore('fieldFilters', filters)
  }

  /**
     * set field from array
     * @param {String} fields
     */
  setFieldsFromArray (fields) {
    if (!fields.length) {
      throw new Error('TableStore: "fields" is declaration!')
    }

    let primaryKey = ''

    const fieldArray = fields.map(field => {
      let type = field.type || 'string'

      let result = {
        id: field.id,
        type: type,
        getter: field.getter || (item => item[field.id]),
        comparator: field.comparator || TableStore.getDefaultComparator(type)
      }

      if (field.isPrimaryKey) {
        if (primaryKey) {
          throw new Error(`TableStore: "primaryKey": ${primaryKey} is already existed`)
        } else {
          primaryKey = field.id
          result['isPrimaryKey'] = true
        }
      }

      return result
    })

    this.primaryKey = primaryKey
    return fieldArray
  }

  /**
     *
     * @param {Array} fields ['id', 'name']
     */
  setFilteringFields (fields) {
    if (Array.isArray(fields)) {
      this.filteringFields = fields.map(filedKey => this.getFieldByKey(filedKey), this)
      Log.info(`set filteringFileds "${fields}"`)
    }
  }

  setCurrentPage (pageNumber) {
    if (isNaN(Number(pageNumber))) {
      Log.error('"pageNumber" must be a Number.')
    }
    const nextPageNumber = pageNumber - 1

    this.getDataByPageNumber(nextPageNumber)
  }

  getCurrentPage () {
    return this.currentPage + 1
  }

  loadDataByPageNumber (pageNumber) {
    switch (this.mode) {
      case MODE.LOAD_ALL:
        this.load({
          currentPage: pageNumber
        })
        break
      case MODE.LOAD_BY_PAGE:
        break
      default:
        return null
    }
  }

  /**
     *
     * @param params
     *  params = {
     *      currentPage: 0
     *  }
     */
  load (params) {
    if (!this.loading) {
      this.loading = true
    }
  }

  updateStore (type, value) {
    if (!this.isInitialed) {
      Log.error('Store is not initial!')
      return null
    }
    Log.info(`store ${type} update!`)

    switch (type) {
      case 'data':
        this.updateByData(value)
        break
      case 'fields':
        this.updateByFields(value)
        break
        // fieldFilter
      case 'fieldFilters':
        this.updateByFieldFilters(value)
        break
        // filterText
      case 'filterText':
        this.updateByFilterText(value)
        break
        // sorting
      case 'sorting':
        this.updateBySorting(value)
        break
      default:
        return null
    }

    // this.reloadStore();
  }

  updateByData (data) {
    this._resultData = this.data = data
    this.totalCount = data.length
  }

  updateByFields (fields) {
    this.fields = fields
    this.isFieldsFiltersChanged = true
  }

  updateByFieldFilters (fields) {
    this.fieldFilters = fields
    this.isFieldsFiltersChanged = true
  }

  updateByFilterText (searchText) {
    this.filterText = searchText
    this.isFilterTextChanged = true
  }

  /**
     *
     * @param {Object} sorting
     * @example
     *  sorting = {
     *      sortkey: 'id',
     *      direction: 'ASC'
     *  }
     */
  updateBySorting (sorting = {
    sortKey: '',
    direction: 'ASC'
  }) {
    this.sorting = sorting
    this.isSortingChanged = true
  }

  reloadStore () {
    const {
      isFieldsFiltersChanged,
      isFilterTextChanged,
      isSortingChanged
    } = this

    Log.info(`
            isFieldsFiltersChanged: ${isFieldsFiltersChanged} ,
            isFilterTextChanged: ${isFilterTextChanged},
            isSortingChanged: ${isSortingChanged}
        `)

    let resultData = this.data

    // fieldFilters > filterText > sorting
    if (isFieldsFiltersChanged && !!resultData.length) {
      // doFieldFilters
      // doFilterText
      // doSorting
      resultData = this.doFieldFilters(resultData)
    }

    if (isFilterTextChanged && !!resultData.length) {
      // doFilterText
      // doSorting
      resultData = this.doFilterText(resultData)
      // resultData = this.doSorting(resultData);
    }

    if (isSortingChanged && !!resultData.length) {
      // doSorting
      resultData = this.doSorting(resultData)
    }

    this._resultData = resultData
    Log.info('Result data is update!')
  }

  /**
     * 计算通过 FieldFilters 的过滤结果
     * @param {Array} list
     * @returns {Array} list
     */
  doFieldFilters (list) {
    if (!list || !list.length) return []
    if (!this.fieldFilters || !this.fieldFilters.length) return list

    let fieldFilteredArray = []
    this.fieldFilters.forEach(filter => {
      const field = this.getFieldByKey(filter.field)
      const filtered = list.filter(item => {
        return item[field.id] === filter.value
      })
      fieldFilteredArray.push(filtered)
    })
    return Utils.intersection.apply(this, fieldFilteredArray)
  }

  /**
     * 计算通过 FilterText 过滤的结果
     * @param {Array} list
     * @returns {Array} list
     */
  doFilterText (list) {
    if (!list || !list.length) return []

    const filteringFields = this.filteringFields
    const textFilterPattern = Utils.searchStringToRegExp(this.filterText)

    if (!textFilterPattern) {
      return list
    }

    if (filteringFields && textFilterPattern) {
      return list.filter(item => {
        return filteringFields.some(field => {
          textFilterPattern.lastIndex = 0
          return textFilterPattern.test(item[field.id])
        })
      })
    }
  }

  /**
     * 计算重排序的结果
     * @param {Array} list
     * @returns {Array} list
     */
  doSorting (list) {
    if (!list || !list.length) return []

    const { sortkey, direction } = this.sorting
    if (!sortkey) {
      Log.error('doSorting "sortKey" is invalid!')
      return []
    }
    const field = this.getFieldByKey(sortkey)
    const comparator = field.comparator

    return Utils.sortByComparator(list, (a, b) => {
      return comparator(a[sortkey], b[sortkey], direction) * (direction === SORT_MODE.ASC ? 1 : -1)
    })
  }

  resetChangeState () {
    this.isFieldsFiltersChanged = false
    this.isFilterTextChanged = false
    this.isSortingChanged = false
    Log.info('reset change state!')
  }

  getDefaultFilteringFields () {
    return this.fields.length ? this.getAllSortKeyByFields(this.fields) : []
  }

  getAllSortKeyByFields (fields) {
    return fields.reduce((keys, item) => {
      return keys.concat(item.id)
    }, [])
  }

  getDefaultSortKey () {
    return this.primaryKey || this.fields[0].id
  }

  static getDefaultComparator (type) {
    switch (type) {
      case String:
      case 'string':
        return Utils.compareStrings

      case Number:
      case 'number':
        return Utils.compareNumbers

      case 'enum':
        return (a, b) => a.value - b.value

      default:
        return (a, b) => a - b
    }
  }

  isValidSortKey (sortKey) {
    return !!this.getFieldByKey(sortKey)
  }
}

export default TableStore
