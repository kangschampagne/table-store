const mockData = [
  {
    id: 1,
    name: 'Niki',
    formattedAddress: 'Chongqing, China'
  },
  {
    id: 3,
    name: 'Kevin',
    formattedAddress: 'Shanghai, China'
  },
  {
    id: 2,
    name: 'Conner',
    formattedAddress: 'Beijing, China'
  }
]

const mockFields = [
  {
    id: 'id',
    type: 'number',
    isPrimaryKey: true
  },
  {
    id: 'name',
    type: 'string',
    isPrimaryKey: false
  },
  {
    id: 'formattedAddress',
    type: 'string',
    isPrimaryKey: false
  }
]

export {
  mockData,
  mockFields
}
