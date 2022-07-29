import { describe, it, beforeEach, expect, vi } from 'vitest'
import { parse } from '../src/parse'

enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

/**
 * https://schema.org/Schedule
 */
interface ParseResult {
  schedule: {
    byDay?: DayOfWeek
    byMonth?: number
    byMonthDay?: number
    byMonthWeek?: number
    repeatFrequency: string
    startDate: string
  }
  match: {
    index: number
    length: number
    text: string
  }
}

describe('parse', () => {
  const TODAY = new Date('2022-01-01')

  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(TODAY)
  })

  it('parses correctly', () => {
    const input = 'every day'
    const output: ParseResult = {
      schedule: {
        repeatFrequency: 'P1D',
        startDate: TODAY.toISOString(),
      },
      match: {
        index: 0,
        length: input.length,
        text: input,
      },
    }
    expect(parse(input)).toEqual(output)
  })
})
