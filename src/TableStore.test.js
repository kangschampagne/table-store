import TableStore from './index';
import {
    mockData,
    mockFields
} from '../mock/index';

class UserStore extends TableStore {
    constructor (params = {}) {
        super({
            storeName: params.storeName || 'UserGroup',

            fields: params.fields,

            data: params.data,

            initialFilteringFields: params.initialFilteringFields,
            initialFilterText: params.initialFilterText,

            initialSortKey: params.initialSortKey,
            initialSortDirection: params.initialSortDirection
        })
    }
}

const mockData_Conner = mockData[2];
const mockData_Kevin = mockData[1];
const mockData_Niki = mockData[0];

const mockFields_id = mockFields[0];
const mockFields_name = mockFields[1];
const mockFields_formattedAddress = mockFields[2];

const mockDataSortASCById = [mockData_Niki,mockData_Conner,mockData_Kevin];
const mockDataSortASCByName = [mockData_Conner,mockData_Kevin,mockData_Niki];
const mockDataSortDESCById = [mockData_Kevin,mockData_Conner,mockData_Niki]

test('param: data', () => {
    let userGroup = new UserStore({
        data: mockData
    });
    expect(userGroup.getData()).toEqual(mockData);
    userGroup.setData([]);
    expect(userGroup.getData()).toEqual([]);
    expect(userGroup.isInitialed).toBe(false);

    userGroup.setFields(mockFields);
    userGroup.setData(mockData);
    expect(userGroup.getResult()).toEqual(mockDataSortASCById);
})

test('setFunc: data', () => {
    let userGroup = new UserStore();
    userGroup.setData(mockData);
    expect(userGroup.getData()).toEqual(mockData);

    userGroup.setData([]);
    expect(userGroup.getData()).toEqual([]);
    expect(userGroup.isInitialed).toBe(false);
})

test('setFunc: set resultData', () => {
    const userGroup = new UserStore({
        data: mockData
    })

    userGroup.resultData = [];
    expect(userGroup.getResult()).toEqual([]);
})

test('param: fields', () => {
    let userGroup = new UserStore({
        data: mockData,
        fields: mockFields
    });
    expect(userGroup.getFields().length).toEqual(mockFields.length);

    userGroup.setFields([{id:'id',type:'number'}]);
    expect(userGroup.getFields().length).toEqual(1);
    expect(userGroup.isInitialed).toBe(true);
})

test('param: fields set', () => {
    let userGroup = new UserStore();
    userGroup.setData(mockData);
    userGroup.setFields(mockFields);
    expect(userGroup.getFields().length).toEqual(mockFields.length);

    userGroup.setFields([{id:'id',type:'number'}]);
    expect(userGroup.getFields().length).toEqual(1);
    expect(userGroup.isInitialed).toBe(true);
})

test('param: initialSortKey', () => {
    const userGroup = new UserStore({
        data: mockData,
        fields: mockFields,
        initialSortKey: 'name'
    })
    expect(userGroup.getResult()).toEqual(mockDataSortASCByName);

    userGroup.setSorting('id', 'DESC');
    expect(userGroup.getResult()).toEqual(mockDataSortDESCById);
})

test('param: sortKey set', () => {
    const userGroup = new UserStore();

    userGroup.setData(mockData);
    userGroup.setFields(mockFields);
    userGroup.setInitialSorting('name', 'ASC');
    expect(userGroup.getResult()).toEqual(mockDataSortASCByName);

    userGroup.setSorting('id', 'DESC');
    expect(userGroup.getResult()).toEqual(mockDataSortDESCById);
})

test('field param: isPrimaryKey', () => {
    let _mockFields = JSON.parse(JSON.stringify(mockFields));
    _mockFields[0].isPrimaryKey = false;
    _mockFields[1].isPrimaryKey = true;

    const userGroup = new UserStore({
        fields: _mockFields,
        data: mockData
    })

    expect(userGroup.getResult()).toEqual(mockDataSortASCByName);
})

test('Unit: doFilterText', () => {
    const userGroup = new UserStore({
        fields: mockFields,
        initialFilteringFields: ['id'],
        initialFilterText: '3'
    })
    const filterResult = userGroup.doFilterText(mockData);
    expect(filterResult).toEqual([mockData_Kevin]);

    const userGroup_1 = new UserStore({
        fields: mockFields,
        initialFilterText: 'k'
    })
    const filterResult_1 = userGroup_1.doFilterText(mockData);
    expect(filterResult_1).toEqual([mockData_Niki, mockData_Kevin]);

    const userGroup_2 = new UserStore({
        fields: mockFields,
        initialFilteringFields: ['name', 'formattedAddress'],
        initialFilterText: 'e'
    })
    const filterResult_2 = userGroup_2.doFilterText(mockData);
    expect(filterResult_2).toEqual([mockData_Kevin, mockData_Conner]);
})

test('Unit: doSorting', () => {
    const userGroup = new UserStore({
        fields: mockFields,
        initialSortKey: 'name',
    })
    const sortingResult = userGroup.doSorting(mockData);
    expect(sortingResult).toEqual(mockDataSortASCByName);
})

test('sorting', () => {
    const userGroup = new UserStore({
        data: mockData,
        fields: mockFields
    });
    
    userGroup.setInitialSorting('id', 'ASC');
    expect(userGroup.getResult()).toEqual(mockDataSortASCById);

    userGroup.setSorting('id', 'DESC');
    expect(userGroup.getResult()).toEqual(mockDataSortDESCById);

    userGroup.setSorting('name');
    expect(userGroup.getResult()).toEqual(mockDataSortASCByName);

    // set func
    const userGroup_1 = new UserStore();
    userGroup_1.setData(mockData);
    userGroup_1.setFields(mockFields);

    userGroup_1.setInitialSorting('id', 'ASC');
    expect(userGroup_1.getResult()).toEqual(mockDataSortASCById);

    userGroup_1.setSorting('id', 'DESC');
    expect(userGroup_1.getResult()).toEqual(mockDataSortDESCById);

    userGroup_1.setSorting('name');
    expect(userGroup_1.getResult()).toEqual(mockDataSortASCByName);
})

test('sorting && textFilter', () => {
    const userGroup = new UserStore({
        data: mockData,
        fields: mockFields
    })

    userGroup.setFilteringFields(['name']);
    userGroup.setFilterText('k');
    userGroup.setSorting('name', 'ASC');
    expect(userGroup.getResult()).toEqual([mockData_Kevin, mockData_Niki]);

    userGroup.setFilteringFields(['id', 'name']);
    userGroup.setFilterText('3');
    expect(userGroup.getResult()).toEqual([mockData_Kevin]);

    userGroup.setSorting('id', 'DESC');
    userGroup.setFilteringFields(['formattedAddress', 'id']);
    userGroup.setFilterText('');
    expect(userGroup.getResult()).toEqual(mockDataSortDESCById);
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
    ]);
    expect(userGroup.getResult()).toEqual([mockData_Conner]);

    userGroup.setFieldFilters([
        {
            field: 'formattedAddress',
            value: 'Shanghai, China'
        }
    ])
    expect(userGroup.getResult()).toEqual([mockData_Kevin]);
})
