/* global test expect */

import TableStore from './index'
import {
  mockData,
  mockFields
} from '../mock/index'

class UserStore extends TableStore {
  constructor (params = {}) {
    super({
      storeName: params.storeName || 'UserGroup',

      fields: params.fields,

      data: params.data,

      initialFieldFilters: params.initialFieldFilters,

      initialFilteringFields: params.initialFilteringFields,
      initialFilterText: params.initialFilterText,

      initialSortKey: params.initialSortKey,
      initialSortDirection: params.initialSortDirection
    })
  }
}

const mockDataConner = mockData[2]
const mockDataKevin = mockData[1]
const mockDataNiki = mockData[0]

const mockDataSortASCById = [mockDataNiki, mockDataConner, mockDataKevin]
const mockDataSortASCByName = [mockDataConner, mockDataKevin, mockDataNiki]
const mockDataSortDESCById = [mockDataKevin, mockDataConner, mockDataNiki]

test('param: data', () => {
  let userGroup = new UserStore({
    data: mockData
  })
  expect(userGroup.getData()).toEqual(mockData)
  userGroup.setData([])
  expect(userGroup.getData()).toEqual([])
  expect(userGroup.isInitialed).toBe(false)

  userGroup.setFields(mockFields)
  userGroup.setData(mockData)
  expect(userGroup.getResult()).toEqual(mockDataSortASCById)
})

test('setFunc: data', () => {
  let userGroup = new UserStore()
  userGroup.setData(mockData)
  expect(userGroup.getData()).toEqual(mockData)

  userGroup.setData([])
  expect(userGroup.getData()).toEqual([])
  expect(userGroup.isInitialed).toBe(false)
})

test('setFunc: set resultData', () => {
  const userGroup = new UserStore({
    data: mockData
  })

  userGroup.resultData = []
  expect(userGroup.getResult()).toEqual([])
})

test('param: initialFieldFilters', () => {
  const fieldFilters = [
    {
      field: 'name',
      value: 'Conner'
    },
    {
      field: 'formattedAddress',
      value: 'Beijing, China'
    }
  ]
  let userGroup = new UserStore({
    data: mockData,
    fields: mockFields,
    initialFieldFilters: fieldFilters
  })
  expect(userGroup.getResult()).toEqual([mockDataConner])
})

test('param: fields', () => {
  let userGroup = new UserStore({
    data: mockData,
    fields: mockFields
  })
  expect(userGroup.getFields().length).toEqual(mockFields.length)

  userGroup.setFields([{ id: 'id', type: 'number' }])
  expect(userGroup.getFields().length).toEqual(1)
  expect(userGroup.isInitialed).toBe(true)
})

test('param: fields set', () => {
  let userGroup = new UserStore()
  userGroup.setData(mockData)
  userGroup.setFields(mockFields)
  expect(userGroup.getFields().length).toEqual(mockFields.length)

  userGroup.setFields([{ id: 'id', type: 'number' }])
  expect(userGroup.getFields().length).toEqual(1)
  expect(userGroup.isInitialed).toBe(true)
})

test('param: initialSortKey', () => {
  const userGroup = new UserStore({
    data: mockData,
    fields: mockFields,
    initialSortKey: 'name'
  })
  expect(userGroup.getResult()).toEqual(mockDataSortASCByName)

  userGroup.setSorting('id', 'DESC')
  expect(userGroup.getResult()).toEqual(mockDataSortDESCById)
})

test('param: sortKey set', () => {
  const userGroup = new UserStore()

  userGroup.setData(mockData)
  userGroup.setFields(mockFields)
  userGroup.setInitialSorting('name', 'ASC')
  expect(userGroup.getResult()).toEqual(mockDataSortASCByName)

  userGroup.setSorting('id', 'DESC')
  expect(userGroup.getResult()).toEqual(mockDataSortDESCById)
})

test('field param: isPrimaryKey', () => {
  let _mockFields = JSON.parse(JSON.stringify(mockFields))
  _mockFields[0].isPrimaryKey = false
  _mockFields[1].isPrimaryKey = true

  const userGroup = new UserStore({
    fields: _mockFields,
    data: mockData
  })

  expect(userGroup.getResult()).toEqual(mockDataSortASCByName)
})

test('Unit: doFilterText', () => {
  const userGroup = new UserStore({
    fields: mockFields,
    initialFilteringFields: ['id'],
    initialFilterText: '3'
  })
  const filterResult = userGroup.doFilterText(mockData)
  expect(filterResult).toEqual([mockDataKevin])

  const userGroup1 = new UserStore({
    fields: mockFields,
    initialFilterText: 'k'
  })
  const filterResult1 = userGroup1.doFilterText(mockData)
  expect(filterResult1).toEqual([mockDataNiki, mockDataKevin])

  const userGroup2 = new UserStore({
    fields: mockFields,
    initialFilteringFields: ['name', 'formattedAddress'],
    initialFilterText: 'e'
  })
  const filterResult2 = userGroup2.doFilterText(mockData)
  expect(filterResult2).toEqual([mockDataKevin, mockDataConner])
})

test('Unit: doSorting', () => {
  const userGroup = new UserStore({
    fields: mockFields,
    initialSortKey: 'name'
  })
  const sortingResult = userGroup.doSorting(mockData)
  expect(sortingResult).toEqual(mockDataSortASCByName)
})

test('sorting', () => {
  const userGroup = new UserStore({
    data: mockData,
    fields: mockFields
  })

  userGroup.setInitialSorting('id', 'ASC')
  expect(userGroup.getResult()).toEqual(mockDataSortASCById)

  userGroup.setSorting('id', 'DESC')
  expect(userGroup.getResult()).toEqual(mockDataSortDESCById)

  userGroup.setSorting('name')
  expect(userGroup.getResult()).toEqual(mockDataSortASCByName)

  // set func
  const userGroup1 = new UserStore()
  userGroup1.setData(mockData)
  userGroup1.setFields(mockFields)

  userGroup1.setInitialSorting('id', 'ASC')
  expect(userGroup1.getResult()).toEqual(mockDataSortASCById)

  userGroup1.setSorting('id', 'DESC')
  expect(userGroup1.getResult()).toEqual(mockDataSortDESCById)

  userGroup1.setSorting('name')
  expect(userGroup1.getResult()).toEqual(mockDataSortASCByName)
})

test('sorting && textFilter', () => {
  const userGroup = new UserStore({
    data: mockData,
    fields: mockFields
  })

  userGroup.setFilteringFields(['name'])
  userGroup.setFilterText('k')
  userGroup.setSorting('name', 'ASC')
  expect(userGroup.getResult()).toEqual([mockDataKevin, mockDataNiki])

  userGroup.setFilteringFields(['id', 'name'])
  userGroup.setFilterText('3')
  expect(userGroup.getResult()).toEqual([mockDataKevin])

  userGroup.setSorting('id', 'DESC')
  userGroup.setFilteringFields(['formattedAddress', 'id'])
  userGroup.setFilterText('')
  expect(userGroup.getResult()).toEqual(mockDataSortDESCById)
})

test('field filter', () => {
  const userGroup = new UserStore({
    data: mockData,
    fields: mockFields
  })

  userGroup.setFieldFilters([
    {
      field: 'name',
      value: 'Conner'
    },
    {
      field: 'formattedAddress',
      value: 'Beijing, China'
    }
  ])
  expect(userGroup.getResult()).toEqual([mockDataConner])

  userGroup.setFieldFilters([
    {
      field: 'formattedAddress',
      value: 'Shanghai, China'
    }
  ])
  expect(userGroup.getResult()).toEqual([mockDataKevin])
})
