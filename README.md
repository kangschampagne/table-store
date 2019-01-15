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

## API
### Initial
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
**type**: `String`
**description**: Set current table store type, for example 'userStore'.  
  

#### storeName  
**type**: `String`  
**description**: Set current table store name. for example 'userList'.
  

#### data  
**type**: `Array`  
**description**: Source data, will not be modified  
  
  
#### fields  
**type**: `Array`  
**required**: `true`  
**description**: table header  
**example**:  
```javascript
fields: [{
    id: 'name',
    type: 'string',
    isPrimaryKey: false
}]
```  
  

#### primaryKey  
**type**: `String`  
**defaultValue**: `id`  
**description**: Set primary key to sorting when store initiated.  
  

#### initialFieldFilters  
**type**: `String`  
**defaultValue**: `[]`  
**description**: Set `fieldFilters` and store will do fields filtering when store initialted.  
  
  
#### initialFilteringFields

#### initialFilterText

#### initialSortKey

#### initialSortDirection


### Set Function
- setData
```javascript
const userGroup = new TableStore({
    data: data
})
// or
const userGroup = new TableStore({})
userGroup.setData()
```

- setField