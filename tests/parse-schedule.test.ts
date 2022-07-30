import { describe, it, beforeEach, expect, vi } from 'vitest'
import { nextMonday, setMonth, setDate, addYears, formatISO } from 'date-fns'
import { DayOfWeek, Month, parseSchedule, ParseScheduleResult } from '../lib'

const TODAY = new Date('2022-02-04')
const TODAY_AS_ISO = formatISO(TODAY)

describe('parseSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  const TEST_CASES: [string | null, ParseScheduleResult | null][] = [
    [null, null],
    ['', null],
    ['hello', null],
    ['every secondday', null],
    ['everysecond day', null],
    ['every once in a while a second day', null],
    ['every 2', null],
    [
      'everyday',
      {
        schedule: {
          repeatFrequency: 'P1D',
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 8,
          text: 'everyday',
        },
      },
    ],
    [
      'daily',
      {
        schedule: {
          repeatFrequency: 'P1D',
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 5,
          text: 'daily',
        },
      },
    ],
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
    ['every  second   week', null],
    // TODO: do we want to support multiple spaces between words?
    // [
    //   'every  second   week',
    //   {
    //     schedule: {
    //       repeatFrequency: 'P2W',
    //       startDate: TODAY_AS_ISO,
    //     },
    //     match: {
    //       index: 0,
    //       length: 20,
    //       text: 'every  second   week',
    //     },
    //   },
    // ],
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
          // today is a firday
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 12,
          text: 'every friday',
        },
      },
    ],
    [
      'every 2nd friday',
      {
        schedule: {
          repeatFrequency: 'P2W',
          byDay: DayOfWeek.Friday,
          // today is a firday
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 16,
          text: 'every 2nd friday',
        },
      },
    ],
    [
      'every 2 friday',
      {
        schedule: {
          repeatFrequency: 'P2W',
          byDay: DayOfWeek.Friday,
          // today is a firday
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 14,
          text: 'every 2 friday',
        },
      },
    ],
    [
      'every 2. friday',
      {
        schedule: {
          repeatFrequency: 'P2W',
          byDay: DayOfWeek.Friday,
          // today is a firday
          startDate: TODAY_AS_ISO,
        },
        match: {
          index: 0,
          length: 15,
          text: 'every 2. friday',
        },
      },
    ],
    [
      'every monday',
      {
        schedule: {
          repeatFrequency: 'P1W',
          byDay: DayOfWeek.Monday,
          startDate: formatISO(nextMonday(TODAY)),
        },
        match: {
          index: 0,
          length: 12,
          text: 'every monday',
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
      'every 2nd june',
      {
        schedule: {
          repeatFrequency: 'P2Y',
          byMonth: Month.June,
          startDate: formatISO(setDate(setMonth(TODAY, 5), 1)),
        },
        match: {
          index: 0,
          length: 14,
          text: 'every 2nd june',
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

  it.each(TEST_CASES)('parses "%s"', (input, output) => {
    expect(parseSchedule(input as string)).toEqual(output)
  })

  describe('triggers', () => {
    const TEST_CASES: string[] = ['each', 'every']

    it.each(TEST_CASES)('triggers on "%s"', (triggerWord) => {
      const input = `${triggerWord} day`
      const output = `P1D`
      expect(parseSchedule(input)?.schedule.repeatFrequency).toEqual(output)
    })
  })

  describe('enumaration', () => {
    const TEST_CASES: [string, number][] = [
      ['first', 1],
      ['second', 2],
      ['third', 3],
      ['fourth', 4],
      ['fifth', 5],
      ['sixth', 6],
      ['seventh', 7],
      ['eigth', 8],
      ['nineth', 9],
      ['tenth', 10],

      ['one', 1],
      ['two', 2],
      ['three', 3],
      ['four', 4],
      ['five', 5],
      ['six', 6],
      ['seven', 7],
      ['eight', 8],
      ['nine', 9],
      ['ten', 10],
      ['eleven', 11],
      ['twelve', 12],
      ['thirteen', 13],
      ['fourteen', 14],
      ['fifteen', 15],
      ['sixteen', 16],
      ['seventeen', 17],
      ['eighteen', 18],
      ['nineteen', 19],
      ['twenty', 20],
      ['twentyone', 21],
      ['twentytwo', 22],
      ['twentythree', 23],
      ['twentyfour', 24],
      ['twentyfive', 25],
      ['twentysix', 26],
      ['twentyseven', 27],
      ['twentyeight', 28],
      ['twentynine', 29],
      ['thirty', 30],

      ['1st', 1],
      ['2nd', 2],
      ['3rd', 3],
      ['4th', 4],
      ['5th', 5],
      ['6th', 6],
      ['7th', 7],
      ['8th', 8],
      ['9th', 9],
      ['10th', 10],
      ['11th', 11],
      ['12th', 12],
      ['21st', 21],
      ['22nd', 22],
      ['23rd', 23],
      ['28th', 28],
      ['300th', 300],

      ['1.', 1],
      ['2.', 2],
      ['3.', 3],
      ['333.', 333],

      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['777', 777],
    ]

    it.each(TEST_CASES)('parses "%s" as "%s"', (enumWord, value) => {
      const input = `every ${enumWord} day`
      const output = `P${value}D`
      expect(parseSchedule(input)?.schedule.repeatFrequency).toEqual(output)
    })
  })

  describe('units', () => {
    const TEST_CASES: [string, string][] = [
      ['second', 's'],
      ['minute', 'm'],
      ['hour', 'h'],
      ['day', 'D'],
      ['week', 'W'],
      ['month', 'M'],
      ['year', 'Y'],
      ['seconds', 's'],
      ['minutes', 'm'],
      ['hours', 'h'],
      ['days', 'D'],
      ['weeks', 'W'],
      ['months', 'M'],
      ['year', 'Y'],
    ]

    it.each(TEST_CASES)('parses "%s" as "%s"', (unitWord, value) => {
      const input = `every second ${unitWord}`
      const output = `P2${value}`
      expect(parseSchedule(input)?.schedule.repeatFrequency).toEqual(output)
    })
  })

  describe('single words', () => {
    const TEST_CASES: [string, string][] = [
      ['everyday', 'P1D'],
      ['daily', 'P1D'],
      ['weekly', 'P1W'],
      ['monthly', 'P1M'],
      ['yearly', 'P1Y'],
    ]

    it.each(TEST_CASES)('parses "%s" as "%s"', (input, output) => {
      expect(parseSchedule(input)?.schedule.repeatFrequency).toEqual(output)
    })
  })

  describe('german', () => {
    const TEST_CASES: [string | null, ParseScheduleResult | null][] = [
      [
        'täglich',
        {
          schedule: {
            repeatFrequency: 'P1D',
            startDate: TODAY_AS_ISO,
          },
          match: {
            index: 0,
            length: 7,
            text: 'täglich',
          },
        },
      ],
      [
        'jeden tag',
        {
          schedule: {
            repeatFrequency: 'P1D',
            startDate: TODAY_AS_ISO,
          },
          match: {
            index: 0,
            length: 9,
            text: 'jeden tag',
          },
        },
      ],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, output) => {
      expect(parseSchedule(input as string, { locales: ['de'] })).toEqual(
        output
      )
    })
  })

  describe('mixed locales', () => {
    const TEST_CASES: [string | null, ParseScheduleResult | null][] = [
      [
        'täglich',
        {
          schedule: {
            repeatFrequency: 'P1D',
            startDate: TODAY_AS_ISO,
          },
          match: {
            index: 0,
            length: 7,
            text: 'täglich',
          },
        },
      ],
      [
        'everyday',
        {
          schedule: {
            repeatFrequency: 'P1D',
            startDate: TODAY_AS_ISO,
          },
          match: {
            index: 0,
            length: 8,
            text: 'everyday',
          },
        },
      ],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, output) => {
      expect(parseSchedule(input as string, { locales: ['en', 'de'] })).toEqual(
        output
      )
    })
  })
})
