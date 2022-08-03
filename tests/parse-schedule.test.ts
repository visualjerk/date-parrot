import { describe, it, beforeEach, expect, vi } from 'vitest'
import { nextMonday, setMonth, setDate, addYears, formatISO } from 'date-fns'
import {
  DayOfWeek,
  Month,
  ParserConfig,
  parseSchedule,
  ParseScheduleResult,
} from '../lib'

type OptionalScheduleResultOptions = Omit<
  ParseScheduleResult['schedule'],
  'repeatFrequency' | 'startDate'
>

type TestCase = [
  string | null,
  string | null,
  Date?,
  OptionalScheduleResultOptions?,
  string?,
  number?
]

const TODAY = new Date('2022-02-04')

function createParseResult(
  input: string | null,
  repeatFrequency: string | null,
  date: Date = TODAY,
  scheduleOptions?: OptionalScheduleResultOptions,
  text = input || '',
  index = 0
): ParseScheduleResult | null {
  if (repeatFrequency == null || date == null) {
    return null
  }
  const output: ParseScheduleResult = {
    schedule: {
      repeatFrequency: repeatFrequency,
      startDate: formatISO(date),
    },
    match: {
      index,
      length: text.length,
      text,
    },
  }
  if (scheduleOptions) {
    for (const [key, value] of Object.entries(scheduleOptions)) {
      output.schedule[key] = value
    }
  }
  return output
}

function expectTestCasesToSucceed(
  testCases: TestCase[],
  config?: ParserConfig
) {
  it.each(testCases)('parses "%s"', (input, ...testCase) => {
    const output = createParseResult(input, ...testCase)
    expect(parseSchedule(input as string, config)).toEqual(output)
  })
}

describe('parseSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  const TEST_CASES: TestCase[] = [
    [null, null],
    ['', null],
    ['hello', null],
    ['every secondday', null],
    ['everysecond day', null],
    ['every once in a while a second day', null],
    ['every 2', null],
    ['every 2n day', null],
    ['everyday', 'P1D'],
    ['daily', 'P1D'],
    ['every day', 'P1D'],
    ['EverY Day', 'P1D'],
    ['every second day', 'P2D'],
    ['Every SecoNd Day', 'P2D'],
    ['every other day', 'P2D'],
    ['every third day', 'P3D'],
    ['every week', 'P1W'],
    ['every second week', 'P2W'],
    ['every  second   week', null],
    [
      'on every second week go crazy',
      'P2W',
      undefined,
      undefined,
      'every second week',
      3,
    ],
    ['every friday', 'P1W', TODAY, { byDay: DayOfWeek.Friday }],
    ['every 2nd friday', 'P2W', TODAY, { byDay: DayOfWeek.Friday }],
    ['every 2 friday', 'P2W', TODAY, { byDay: DayOfWeek.Friday }],
    ['every 2. friday', 'P2W', TODAY, { byDay: DayOfWeek.Friday }],
    ['every monday', 'P1W', nextMonday(TODAY), { byDay: DayOfWeek.Monday }],
    [
      'every june',
      'P1Y',
      setDate(setMonth(TODAY, 5), 1),
      { byMonth: Month.June },
    ],
    [
      'every 2nd june',
      'P1Y',
      new Date('2022-06-02:01:00:00'),
      { byMonth: Month.June },
    ],
    [
      'every january',
      'P1Y',
      addYears(setDate(setMonth(TODAY, 0), 1), 1),
      { byMonth: Month.January },
    ],
    [
      'every 2nd june 10:00',
      'P1Y',
      new Date('2022-06-02:10:00:00'),
      { byMonth: Month.June },
    ],
    [
      'every 2nd june at 10:00',
      'P1Y',
      new Date('2022-06-02:10:00:00'),
      { byMonth: Month.June },
    ],
    [
      '10:00 every 2nd june',
      'P1Y',
      new Date('2022-06-02:10:00:00'),
      { byMonth: Month.June },
    ],
    [
      'at 10:00 every 2nd june',
      'P1Y',
      new Date('2022-06-02:10:00:00'),
      { byMonth: Month.June },
    ],
    ['every 2nd day at 10:00', 'P2D', new Date('2022-02-04:10:00:00')],
    ['at 14:21 every 2nd week', 'P2W', new Date('2022-02-04:14:21:00')],
    [
      'at 25:00 every 2nd week',
      'P2W',
      undefined,
      undefined,
      'every 2nd week',
      9,
    ],
  ]

  expectTestCasesToSucceed(TEST_CASES)

  describe('triggers', () => {
    const TEST_CASES: string[] = ['each', 'every']

    it.each(TEST_CASES)('triggers on "%s"', (triggerWord) => {
      const input = `${triggerWord} day`
      const output = `P1D`
      expect(parseSchedule(input)?.schedule.repeatFrequency).toEqual(output)
    })
  })

  describe('integers', () => {
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

  describe('word boundaries', () => {
    const TEST_CASES_TRIGGER: string[] = ' \n\t'.split('')

    it.each(TEST_CASES_TRIGGER)(
      'respects "%s" as trigger boundary',
      (boundary) => {
        const input = `${boundary}every day`
        expect(parseSchedule(input)).toBeTruthy()
      }
    )

    const TEST_CASES_CLOSING: string[] = ' .,;:!?\n\t'.split('')

    it.each(TEST_CASES_CLOSING)(
      'respects "%s" as closing boundary',
      (boundary) => {
        const input = `every day${boundary}`
        expect(parseSchedule(input)).toBeTruthy()
      }
    )
  })

  describe('german', () => {
    const TEST_CASES: TestCase[] = [
      ['täglich', 'P1D'],
      ['jeden tag', 'P1D'],
      ['alle zwei tage', 'P2D'],
    ]
    expectTestCasesToSucceed(TEST_CASES, { locales: ['de'] })
  })

  describe('mixed locales', () => {
    const TEST_CASES: TestCase[] = [
      ['täglich', 'P1D'],
      ['everyday', 'P1D'],
    ]
    expectTestCasesToSucceed(TEST_CASES, { locales: ['en', 'de'] })
  })
})
