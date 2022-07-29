import { describe, it, beforeEach, expect, vi } from 'vitest'
import { nextFriday, setMonth, setDate, addYears, formatISO } from 'date-fns'
import { DayOfWeek, Month, parse, ParseResult } from '../src/parse'

const TODAY = new Date('2022-02-04')
const TODAY_AS_ISO = formatISO(TODAY)
const TEST_CASES: [string, ParseResult | null][] = [
  ['', null],
  ['hello', null],
  ['everyday', null],
  ['every secondday', null],
  ['everysecond day', null],
  ['every once in a while a second day', null],
  [
    'every day',
    {
      schedule: {
        repeatFrequency: 'P1D',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 9,
        text: 'every day',
      },
    },
  ],
  [
    'EverY Day',
    {
      schedule: {
        repeatFrequency: 'P1D',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 9,
        text: 'EverY Day',
      },
    },
  ],
  [
    'every second day',
    {
      schedule: {
        repeatFrequency: 'P2D',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 16,
        text: 'every second day',
      },
    },
  ],
  [
    'Every SecoNd Day',
    {
      schedule: {
        repeatFrequency: 'P2D',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 16,
        text: 'Every SecoNd Day',
      },
    },
  ],
  [
    'every third day',
    {
      schedule: {
        repeatFrequency: 'P3D',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 15,
        text: 'every third day',
      },
    },
  ],
  [
    'every week',
    {
      schedule: {
        repeatFrequency: 'P1W',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 10,
        text: 'every week',
      },
    },
  ],
  [
    'every second week',
    {
      schedule: {
        repeatFrequency: 'P2W',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 17,
        text: 'every second week',
      },
    },
  ],
  [
    'every  second   week',
    {
      schedule: {
        repeatFrequency: 'P2W',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 0,
        length: 20,
        text: 'every  second   week',
      },
    },
  ],
  [
    'on every second week go crazy',
    {
      schedule: {
        repeatFrequency: 'P2W',
        startDate: TODAY_AS_ISO,
      },
      match: {
        index: 3,
        length: 17,
        text: 'every second week',
      },
    },
  ],
  [
    'every friday',
    {
      schedule: {
        repeatFrequency: 'P1W',
        byDay: DayOfWeek.Friday,
        startDate: formatISO(nextFriday(TODAY)),
      },
      match: {
        index: 0,
        length: 12,
        text: 'every friday',
      },
    },
  ],
  [
    'every june',
    {
      schedule: {
        repeatFrequency: 'P1Y',
        byMonth: Month.June,
        startDate: formatISO(setDate(setMonth(TODAY, 5), 1)),
      },
      match: {
        index: 0,
        length: 10,
        text: 'every june',
      },
    },
  ],
  [
    'every january',
    {
      schedule: {
        repeatFrequency: 'P1Y',
        byMonth: Month.January,
        startDate: formatISO(addYears(setDate(setMonth(TODAY, 0), 1), 1)),
      },
      match: {
        index: 0,
        length: 13,
        text: 'every january',
      },
    },
  ],
]

describe('parse', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  it.each(TEST_CASES)('parses "%s"', (input, output) => {
    expect(parse(input)).toEqual(output)
  })
})
