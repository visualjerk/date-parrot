import { describe, it, beforeEach, expect, vi } from 'vitest'
import { DayOfWeek, Month, parse, ParseResult } from '../src/parse'

const TODAY = new Date('2022-01-01')
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
        startDate: TODAY.toISOString(),
      },
      match: {
        index: 0,
        length: 9,
        text: 'every day',
      },
    },
  ],
  [
    'every second day',
    {
      schedule: {
        repeatFrequency: 'P2D',
        startDate: TODAY.toISOString(),
      },
      match: {
        index: 0,
        length: 16,
        text: 'every second day',
      },
    },
  ],
  [
    'every third day',
    {
      schedule: {
        repeatFrequency: 'P3D',
        startDate: TODAY.toISOString(),
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
        startDate: TODAY.toISOString(),
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
        startDate: TODAY.toISOString(),
      },
      match: {
        index: 0,
        length: 17,
        text: 'every second week',
      },
    },
  ],
  [
    'on every second week do workout',
    {
      schedule: {
        repeatFrequency: 'P2W',
        startDate: TODAY.toISOString(),
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
        // TODO: needs to be next friday
        startDate: TODAY.toISOString(),
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
        // TODO: needs to the 1st of june
        startDate: TODAY.toISOString(),
      },
      match: {
        index: 0,
        length: 10,
        text: 'every june',
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
