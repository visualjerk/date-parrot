import { describe, it, beforeEach, expect, vi } from 'vitest'
import { formatISO, addDays } from 'date-fns'
import { parseDate, ParseDateResult } from '../lib'

const TODAY = new Date('2022-02-04 01:00:00')
const TODAY_AS_ISO = formatISO(TODAY)

describe('parseDate', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  const TEST_CASES: [string | null, null | Date, string?, number?][] = [
    [null, null],
    ['', null],
    ['hello', null],
    ['heytoday', null],
    ['todayson', null],
    ['hey todayson', null],
    ['today', TODAY],
    ['tomorrow', addDays(TODAY, 1)],
    ['tame a bear tomorrow', addDays(TODAY, 1), 'tomorrow', 12],
    ['tomorrow tame a bear', addDays(TODAY, 1), 'tomorrow'],
    ['yesterday', addDays(TODAY, -1)],
    ['friday', TODAY],
    ['saturday', addDays(TODAY, 1)],
    ['monday', addDays(TODAY, 3)],
    ['next saturday', addDays(TODAY, 1)],
    ['next friday', addDays(TODAY, 7)],
    ['may', new Date('2022-05-01 01:00:00')],
    ['january', new Date('2023-01-01 01:00:00')],
    ['february', new Date('2023-02-01 01:00:00')],
    ['next february', new Date('2023-02-01 01:00:00')],
  ]

  it.each(TEST_CASES)(
    'parses "%s"',
    (input, date, text = input || '', index = 0) => {
      const output =
        date === null
          ? null
          : {
              date: formatISO(date),
              match: {
                index,
                length: text.length,
                text,
              },
            }
      expect(parseDate(input as string)).toEqual(output)
    }
  )

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
