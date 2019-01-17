# table-store
table store can 

[![Build Status](https://travis-ci.com/kangschampagne/table-store.svg?branch=master)](https://travis-ci.com/kangschampagne/table-store)
[![Coverage Status](https://coveralls.io/repos/github/kangschampagne/table-store/badge.svg)](https://coveralls.io/github/kangschampagne/table-store)

## Feature
- Simple API
- Implement filtering and sorting in the table

## Get and initialize
```bash
$ git clone https://github.com/kangschampagne/table-store.git
$ cd table-store
$ npm install
$ npm start
```

Used **tabel-store** in the project 
```bash
$ npm install @kangschampagne/table-store
```

## Instructions

### Simple demo
```javascript
import TableStore from '@kangschampagne/table-store'

const userGroup = new TableStore({
  data: [
    {
      id: 1,
      name: 'conner'
    },
    {
      id: 2,
      name: 'kite'
    }
  ],
  fields: [
    {
      id: 'id',
      type: 'number'
    },
    {
      id: 'name',
      type: 'string'
    }
  ]
}

// filter
userGroup.setFilteringFields(['name'])
userGroup.setFilterText('k')

// sort
userGroup.setSorting('id', 'DESC')

// field filter
userGroup.setFieldFilters([
    {
        field: 'name',
        value: 'conner'
    }
])

// get result
// it will recalculate the result and does not affect the original data when the following method is called
userGroup.getResult()
console.log(userGroup.resultData)
```


## API Contents

<details>
<summary>Initial Params</summary>

* [`storeType`](#storeType)
* [`storeName`](#storeName)
* [`data`](#data)
* [`fields`](#fields)
* [`primaryKey`](#primaryKey)
* [`initialFieldFilters`](#initialFieldFilters)
* [`initialFilteringFields`](#initialFilteringFields)
* [`initialFilterText`](#initialFilterText)
* [`initialSortKey`](#initialSortKey)
* [`initialSortDirection`](#initialSortDirection)

</details>

<details>
<summary>Set Function API</summary>

* [`store.initial(params)`](#store.initial(params))
* [`store.setData(datas)`](#store.setData(datas))
* [`store.setField(fields)`](#store.setField(fields))
* [`store.setInitialFieldFilters(filters)`](#store.setInitialFieldFilters(filters))
* [`store.setInitialFilterText(text)`](#store.setInitialFilterText(text))
* [`store.setInitialFilteringFields(fields)`](#store.setInitialFilteringFields(fields))
* [`store.setInitialSorting(sortKey, direction)`](#store.setInitialSorting(sortKey,direction)))

</details>

<details>
<summary>Get Function API</summary>

* [`store.getData()`](#store.getData())
* [`store.getResult()`](#store.getResult())
* [`store.getFields()`](#store.getFields())
* [`store.getFieldByKey(sortKey)`](#store.getFieldByKey(sortKey))
* [`store.getAllSortKeyByFields(fields)`](#store.getAllSortKeyByFields(fields))
* [`store.getDefaultFilteringFields()[Obsolete]`](#store.getDefaultFilteringFields()[Obsolete])

</details>


## API Detail

### Initial Params
```javascript
const userGroup = new TableStore({
    storeType: 'demo',
    storeName: 'demoStore',

    data: [],
    fields: [],
    primaryKey: 'id',

    initialFieldFilters: [],

    initialFilteringFields: [],
    initialFilterText: '',

    initialSortKey: '',
    initialSortDirection: 'ASC'
})
```

#### storeType  
- type: `String`  
- description: Set current table store type, for example 'userStore'.  
  

#### storeName  
- type: `String`  
- description: Set current table store name. for example 'userList'.
  

#### data  
- type: `Array`  
- description: Source data, will not be modified  
  
  
#### fields  
- type: `Array`  
- required: `true`  
- description: table header  
-   <details>
    <summary>Examples</summary>

    ```js
    fields: [{
        id: 'name',
        type: 'string',
        isPrimaryKey: false
    }]
    ```  

    </details>
  

#### primaryKey  
- type: `String`  
- defaultValue: `''` or `fields[0].id` or `id`  
- description: Set primary key to sorting when store initiated. Suggess use 'initialSortKey' to replace it.  
  

#### initialFieldFilters  
- type: `Array`  
- defaultValue: `[]`  
- description: Set `fieldFilters` and store will do fields filtering when store initialted.  
-   <details>
    <summary>Examples</summary>

    ```js
    fieldFilter: [
        {
            field: 'name',
            value: 'Conner'
        },
        {
            field: 'formattedAddress',
            value: 'Beijing, China'
        }
    ]
    ```  

    </details>
  
  
#### initialFilteringFields  
- type: `Array{String}`  
- defaultValue: `[]`  
- description: Set `filteringFields` for text filter (`filterText`). if `filteringFields` is empty array, `store` will filter through all `fields`.  
-   <details>
    <summary>Examples</summary>

    ```js
    const userGroup = new UserStore({
        // ...
        initialFilteringFields: ['id', 'name'],
        initialFilterText: '1'
    })
    // It will filter items by text '1' in 'id' & 'name' field when store initialted.
    ```  

    </details>
  

#### initialFilterText  
- type: `String`  
- defaultValue: `''`  
- description: Set filter text, Cooperate with `filteringFields`.  
-   <details>
    <summary>Examples</summary>

    ```js
    const userGroup = new UserStore({
        // ...
        // initialFilteringFields: [],
        initialFilterText: '1'
    })
    // This will filter items by text '1' in all fields when store initialted.
    ```  

    </details>
  

#### initialSortKey  
- type: `String`  
- defaultValue: `primaryKey` or `first field's id`  
- description: Set sorting key. Store items will sort by `sortingKey`  and default 'ASC' direction when store initiated.  
-   <details>
    <summary>Examples</summary>

    ```js
    const userGroup = new UserStore({
        initialSortKey: 'name'
    })
    ```

    </details> 


#### initialSortDirection  
- type: `String`  
- defaultValue: `ASC` or `DESC`  
- description: Set sorting direction. Store items will sort by `sortingKey` and `sortDirection` when store initiated.  
-   <details>
    <summary>Examples</summary>

    ```js
    const userGroup = new UserStore({
        // initialSortKey: 'name',
        initialSortDirection: 'DESC'
    })
    ```  

    </details> 
  
    
### Set Function API
#### store.initial(params)
#### store.setData(datas)
#### store.setField(fields)
#### store.setInitialFieldFilters(filters)
#### store.setInitialFilterText(text)
#### store.setInitialFilteringFields(fields)
#### store.setInitialSorting(sortKey,direction)

### Get Function API
#### store.getData()
#### store.getResult()
#### store.getFields()
#### store.getFieldByKey(sortKey)
#### store.getDefaultSortKey()
#### store.getAllSortKey()

### Action API
#### store.setFieldFilters(filters)
#### store.setFilteringFields(fields)
#### store.setFilterText(filterText)
#### store.setSorting(sortKey,direciton)

### Other API
#### store.reloadStore()
#### store.isValidSortKey(sortKey)
#### store.updateStore()[Obsolete]
#### store.updateByData()[Obsolete]
#### store.updateByFields()[Obsolete]
#### store.updateByFieldFilters()[Obsolete]
#### store.updateByFilterText()[Obsolete]
#### store.updateBySorting()[Obsolete]
#### store.doFieldFilters(listData)[Obsolete]
#### store.doFilterText(listData)[Obsolete]
#### store.doSorting(listData)[Obsolete]
#### store.resetChangeState()[Obsolete]

### Obsoleted API
#### store.getAllSortKeyByFields(fields)[Obsolete]
#### store.getDefaultFilteringFields()[Obsolete]
#### store.setFieldsFromArray()[Obsolete]

## TODO
#### store.load()
#### store.getCurrentPage()
#### store.loadDataByPageNumber()
#### store.setPrimaryKey(key)

