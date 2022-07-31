import { describe, it, beforeEach, expect, vi } from 'vitest'
import { formatISO, addDays } from 'date-fns'
import { parseDate, ParseDateResult } from '../lib'

type TestCase = [string | null, null | Date, string?, number?]

const TODAY = new Date('2022-02-04 01:00:00')

function createParseResult(
  input: string | null,
  date: Date | null,
  text = input || '',
  index = 0
): ParseDateResult | null {
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
  return output
}

describe('parseDate', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  const TEST_CASES: TestCase[] = [
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

  it.each(TEST_CASES)('parses "%s"', (input, ...testCase) => {
    const output = createParseResult(input, ...testCase)
    expect(parseDate(input as string)).toEqual(output)
  })

  describe('german', () => {
    const TEST_CASES: TestCase[] = [
      ['heute', TODAY],
      ['morgen', addDays(TODAY, 1)],
      ['übermorgen', addDays(TODAY, 2)],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, ...testCase) => {
      const output = createParseResult(input, ...testCase)
      expect(parseDate(input as string, { locales: ['de'] })).toEqual(output)
    })
  })

  describe('mixed locales', () => {
    const TEST_CASES: TestCase[] = [
      ['heute', TODAY],
      ['today', TODAY],
    ]

    it.each(TEST_CASES)('parses "%s"', (input, ...testCase) => {
      const output = createParseResult(input, ...testCase)
      expect(parseDate(input as string, { locales: ['en', 'de'] })).toEqual(
        output
      )
    })
  })
})
