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
    [
      'friday',
      {
        date: TODAY_AS_ISO,
        match: {
          index: 0,
          length: 6,
          text: 'friday',
        },
      },
    ],
    [
      'saturday',
      {
        date: formatISO(addDays(TODAY, 1)),
        match: {
          index: 0,
          length: 8,
          text: 'saturday',
        },
      },
    ],
    [
      'monday',
      {
        date: formatISO(addDays(TODAY, 3)),
        match: {
          index: 0,
          length: 6,
          text: 'monday',
        },
      },
    ],
    [
      'next saturday',
      {
        date: formatISO(addDays(TODAY, 1)),
        match: {
          index: 0,
          length: 13,
          text: 'next saturday',
        },
      },
    ],
    [
      'next friday',
      {
        date: formatISO(addDays(TODAY, 7)),
        match: {
          index: 0,
          length: 11,
          text: 'next friday',
        },
      },
    ],
    [
      'may',
      {
        date: formatISO(new Date('2022-05-01 01:00:00')),
        match: {
          index: 0,
          length: 3,
          text: 'may',
        },
      },
    ],
    [
      'january',
      {
        date: formatISO(new Date('2023-01-01 01:00:00')),
        match: {
          index: 0,
          length: 7,
          text: 'january',
        },
      },
    ],
    [
      'february',
      {
        date: formatISO(new Date('2023-02-01 01:00:00')),
        match: {
          index: 0,
          length: 8,
          text: 'february',
        },
      },
    ],
    [
      'next february',
      {
        date: formatISO(new Date('2023-02-01 01:00:00')),
        match: {
          index: 0,
          length: 13,
          text: 'next february',
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
      [
        'übermorgen',
        {
          date: formatISO(addDays(TODAY, 2)),
          match: {
            index: 0,
            length: 10,
            text: 'übermorgen',
          },
        },
      ],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, output) => {
      expect(parseDate(input as string, { locales: ['de'] })).toEqual(output)
    })
  })

  describe('mixed locales', () => {
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
    ]

    it.each(TEST_CASES)('parses "%s"', (input, output) => {
      expect(parseDate(input as string, { locales: ['en', 'de'] })).toEqual(
        output
      )
    })
  })
})
