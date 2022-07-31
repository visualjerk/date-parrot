import { describe, it, beforeEach, expect, vi } from 'vitest'
import { formatISO, addDays } from 'date-fns'
import { parseDate, ParseDateResult, ParserConfig } from '../lib'

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

function expectTestCasesToSucceed(
  testCases: TestCase[],
  config?: ParserConfig
) {
  it.each(testCases)('parses "%s"', (input, ...testCase) => {
    const output = createParseResult(input, ...testCase)
    expect(parseDate(input as string, config)).toEqual(output)
  })
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
    ['2n friday', TODAY, 'friday', 3],
    ['friday 2n', TODAY, 'friday'],
    ['saturday', addDays(TODAY, 1)],
    ['monday', addDays(TODAY, 3)],
    ['next saturday', addDays(TODAY, 1)],
    ['next friday', addDays(TODAY, 7)],
    ['may', new Date('2022-05-01 01:00:00')],
    ['january', new Date('2023-01-01 01:00:00')],
    ['february', new Date('2023-02-01 01:00:00')],
    ['next february', new Date('2023-02-01 01:00:00')],
    ['3. february', new Date('2023-02-03 01:00:00')],
    ['4. february', new Date('2022-02-04 01:00:00')],
    ['11. february', new Date('2022-02-11 01:00:00')],
    ['11st february', new Date('2022-02-11 01:00:00')],
    ['22nd february', new Date('2022-02-22 01:00:00')],
    ['23nd february', new Date('2022-02-23 01:00:00')],
    ['28th february', new Date('2022-02-28 01:00:00')],
    ['february 3.', new Date('2023-02-03 01:00:00')],
    // ['february 28th', new Date('2022-02-28 01:00:00')],
  ]
  expectTestCasesToSucceed(TEST_CASES)

  describe('german', () => {
    const TEST_CASES: TestCase[] = [
      ['heute', TODAY],
      ['morgen', addDays(TODAY, 1)],
      ['übermorgen', addDays(TODAY, 2)],
    ]
    expectTestCasesToSucceed(TEST_CASES, { locales: ['de'] })
  })

  describe('mixed locales', () => {
    const TEST_CASES: TestCase[] = [
      ['heute', TODAY],
      ['today', TODAY],
    ]
    expectTestCasesToSucceed(TEST_CASES, { locales: ['en', 'de'] })
  })
})
