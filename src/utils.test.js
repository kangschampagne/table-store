/* global test expect */

import * as Utils from './utils'

test('compareStrings', () => {
  expect(Utils.compareStrings()).toEqual(0)
  expect(Utils.compareStrings('a', 'a')).toEqual(0)

  expect(Utils.compareStrings('', 'b', 'ASC')).toEqual(1)
  expect(Utils.compareStrings('a', '', 'DESC')).toEqual(1)

  expect(Utils.compareStrings('', 'b', 'DESC')).toEqual(-1)
  expect(Utils.compareStrings('a', '', 'ASC')).toEqual(-1)

  expect(Utils.compareStrings('a', 'b', 'ASC')).toEqual(-1)
  expect(Utils.compareStrings('b', 'a', 'ASC')).toEqual(1)
  expect(Utils.compareStrings('a', 'b', 'DESC')).toEqual(1)
  expect(Utils.compareStrings('b', 'a', 'DESC')).toEqual(-1)
})

test('compareNumbers', () => {
  expect(Utils.compareNumbers('a', 'b')).toEqual(0)
  expect(Utils.compareNumbers(1, 1)).toEqual(0)

  expect(Utils.compareNumbers('a', 1, 'ASC')).toEqual(1)
  expect(Utils.compareNumbers(1, 'b', 'DESC')).toEqual(1)

  expect(Utils.compareNumbers('a', 1, 'DESC')).toEqual(-1)
  expect(Utils.compareNumbers(1, 'b', 'ASC')).toEqual(-1)

  expect(Utils.compareNumbers(1, 2, 'ASC')).toEqual(-1)
  expect(Utils.compareNumbers(2, 1, 'ASC')).toEqual(1)
})

test('sortByComparator', () => {
  const list = [
    {
      id: 1,
      name: 'conner'
    },
    {
      id: 2,
      name: 'nike'
    },
    {
      id: 3,
      name: 'kevin'
    }
  ]

  const sortedCase1 = Utils.sortByComparator(list, (a, b) => {
    // DESC
    return b.id - a.id
  })
  expect(sortedCase1).toEqual([list[2], list[1], list[0]])

  const sortedCase2 = Utils.sortByComparator(list, (a, b) => {
    return Utils.compareStrings(a.name, b.name, 'ASC')
  })
  expect(sortedCase2).toEqual([list[0], list[2], list[1]])
})

test('getClearText', () => {
  expect(Utils.getClearText('<script>this is javascript area!</script>')).toEqual('this is javascript area!')
  expect(Utils.getClearText('')).toEqual('')
})

test('searchStringToRegExp', () => {
  expect(Utils.searchStringToRegExp('a')).toEqual(/(.*?)(a)(.*?)/gi)
  expect(Utils.searchStringToRegExp('')).toBe(null)
})

test('intersection', () => {
  expect(Utils.intersection([1, 2, 3, 4], [2, 3, 6, 8])).toEqual([2, 3])
  expect(Utils.intersection([], [1, 2, 3])).toEqual([])

  expect(Utils.intersection()).toEqual([])
})
