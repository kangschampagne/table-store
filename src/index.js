import TableStore from './TableStore';

// mock data
// import { mockData, mockFields } from '../mock/index';

// class UserStore extends TableStore {
//     constructor (params = {}) {
//         super({
//             storeName: params.storeName || 'UserGroup',

//             fields: params.fields,

//             data: params.data,

//             initialFilteringFields: params.initialFilteringFields,
//             initialFilterText: params.initialFilterText,

//             initialSortKey: params.initialSortKey,
//             initialSortDirection: params.initialSortDirection
//         })
//     }
// }

// const userGroup = new UserStore({
//     data: mockData,
//     fields: mockFields
// })

// const userGroup = new UserStore();
// userGroup.setData(mockData);
// userGroup.setFields(mockFields);

// initial
// userGroup.setInitialSorting('name', 'DESC');
// userGroup.setInitialFilterText('co');

// todo something.

// userGroup.setFilteringFields(['name']);
// userGroup.setFilterText('k');
// userGroup.setSorting('name', 'ASC');

// console.log(userGroup.resultData);

// userGroup.setFilteringFields(['formattedAddress']);
// userGroup.setFilterText('');

// userGroup.setFieldFilters([
//     {
//         field: 'name',
//         value: 'Conner'
//     },
//     {
//         field: 'formattedAddress',
//         value: 'Beijing, China'
//     }
// ]);

// console.log(userGroup.resultData);


// const userGroup = new UserStore({
//     data: mockData
// });

// userGroup.setInitialSorting('');

// console.log(userGroup);

// console.log(userGroup.getResult())

export default TableStore;
// export var ${globalName} = TableStore;
