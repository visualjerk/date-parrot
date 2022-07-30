import { describe, it, beforeEach, expect, vi } from 'vitest'
import { formatISO, addDays } from 'date-fns'
import { parseDate, ParseDateResult } from '../lib'

const TODAY = new Date('2022-02-04')
const TODAY_AS_ISO = formatISO(TODAY)

describe('parseDate', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  const TEST_CASES: [string | null, ParseDateResult | null][] = [
    [null, null],
    ['', null],
    ['hello', null],
    ['heytoday', null],
    ['todayson', null],
    ['hey todayson', null],
    [
      'today',
      {
        date: TODAY_AS_ISO,
        match: {
          index: 0,
          length: 5,
          text: 'today',
        },
      },
    ],
    [
      'tomorrow',
      {
        date: formatISO(addDays(TODAY, 1)),
        match: {
          index: 0,
          length: 8,
          text: 'tomorrow',
        },
      },
    ],
    [
      'tame a bear tomorrow',
      {
        date: formatISO(addDays(TODAY, 1)),
        match: {
          index: 12,
          length: 8,
          text: 'tomorrow',
        },
      },
    ],
    [
      'tomorrow tame a bear',
      {
        date: formatISO(addDays(TODAY, 1)),
        match: {
          index: 0,
          length: 8,
          text: 'tomorrow',
        },
      },
    ],
    [
      'yesterday',
      {
        date: formatISO(addDays(TODAY, -1)),
        match: {
          index: 0,
          length: 9,
          text: 'yesterday',
        },
      },
    ],
  ]

  it.each(TEST_CASES)('parses "%s"', (input, output) => {
    expect(parseDate(input as string)).toEqual(output)
  })

  describe('german', () => {
    const TEST_CASES: [string | null, ParseDateResult | null][] = [
      [
        'heute',
        {
          date: TODAY_AS_ISO,
          match: {
            index: 0,
            length: 5,
            text: 'heute',
          },
        },
      ],
      [
        'morgen',
        {
          date: formatISO(addDays(TODAY, 1)),
          match: {
            index: 0,
            length: 6,
            text: 'morgen',
          },
        },
      ],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, output) => {
      expect(parseDate(input as string, { locales: ['de'] })).toEqual(output)
    })
  })
})
