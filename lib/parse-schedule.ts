import {
  setDay,
  setDate,
  setMonth,
  addWeeks,
  addYears,
  isPast,
  formatISO,
} from 'date-fns'
import { DayOfWeek, Month, ParserConfig } from './types'
import { locales } from './locales'
import {
  onSingleWordMatch,
  onTriggerWordMatch,
  onMiddleWordMatch,
  onClosingWordMatch,
} from './utils'

/**
 * https://schema.org/Schedule
 */
export interface ParseScheduleResult {
  schedule: {
    byDay?: DayOfWeek
    byMonth?: Month
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

export function parseSchedule(
  input: string,
  config: ParserConfig = { locales: ['en'] }
): ParseScheduleResult | null {
  if (!input) {
    return null
  }

  const localeConfigs = config.locales.map((key) => locales[key])

  for (const config of localeConfigs) {
    const {
      DAY_OF_WEEK_WORDS,
      MONTH_WORDS,
      SCHEDULE_TRIGGER_WORDS,
      SCHEDULE_SINGLE_WORDS,
      ENUM_WORDS,
      UNIT_WORDS,
      ENUM_SUFFIX,
    } = config

    let repeatFrequency: string | undefined
    let index = 0
    let text = ''
    let byDay: DayOfWeek | undefined
    let byMonth: Month | undefined
    let startDate = new Date()

    // See if we have a single word
    const singleWordMatch = onSingleWordMatch(
      SCHEDULE_SINGLE_WORDS,
      input,
      (matchIndex, matchText, value) => {
        index = matchIndex
        text = matchText
        repeatFrequency = `P${value}`
      }
    )

    if (singleWordMatch && repeatFrequency) {
      const output: ParseScheduleResult = {
        schedule: {
          repeatFrequency,
          startDate: formatISO(startDate),
          byDay,
          byMonth,
        },
        match: {
          index,
          length: text.length,
          text,
        },
      }
      return output
    }

    // See if we have a schedule trigger word
    const scheduleTriggerMatch = onTriggerWordMatch(
      SCHEDULE_TRIGGER_WORDS,
      input,
      (matchIndex, matchText) => {
        index = matchIndex
        text = matchText
        input = input.slice(index + text.length)
      }
    )

    if (!scheduleTriggerMatch) {
      continue
    }

    // See if we have an enumaration like "2", "4.", "20th", etc.
    let enumMatch = false
    const match = input.match(new RegExp(`^(\\d+)(${ENUM_SUFFIX}|.)? `, 'i'))
    if (match && match[0]) {
      const value = match[1]
      repeatFrequency = `P${value}`
      text = `${text}${match[0]}`
      input = input.slice(match[0].length)
      enumMatch = true
    }

    // See if we have a distinct enum word like "first", "2nd", etc.
    if (!enumMatch) {
      enumMatch = onMiddleWordMatch(
        ENUM_WORDS,
        input,
        (_, matchText, value) => {
          repeatFrequency = `P${value}`
          text = `${text}${matchText}`
          input = input.slice(matchText.length)
        }
      )
    }

    // If we dont't have an enum match, the frequency is set to 1
    if (!enumMatch) {
      repeatFrequency = 'P1'
    }

    // See if we have a unit word like "minute", "hour", etc.
    const unitWordMatch = onClosingWordMatch(
      UNIT_WORDS,
      input,
      (_, matchText, unit) => {
        repeatFrequency = `${repeatFrequency}${unit}`
        text = `${text}${matchText}`
      }
    )

    // If we don't have a unit word, see if we have a week day
    if (!unitWordMatch) {
      const weekDayMatch = onClosingWordMatch(
        DAY_OF_WEEK_WORDS,
        input,
        (_, matchText, value) => {
          repeatFrequency = `${repeatFrequency}W`
          byDay = value
          startDate = setDay(startDate, byDay, { weekStartsOn: 1 })
          if (isPast(startDate)) {
            startDate = addWeeks(startDate, 1)
          }
          text = `${text}${matchText}`
        }
      )
      // See if we have a month
      if (!weekDayMatch) {
        const monthMatch = onClosingWordMatch(
          MONTH_WORDS,
          input,
          (_, matchText, value) => {
            repeatFrequency = `${repeatFrequency}Y`
            byMonth = value
            startDate = setDate(setMonth(startDate, byMonth - 1), 1)
            if (isPast(startDate)) {
              startDate = addYears(startDate, 1)
            }
            text = `${text}${matchText}`
          }
        )

        if (!monthMatch) {
          continue
        }
      }
    }

    if (!repeatFrequency) {
      continue
    }

    const output: ParseScheduleResult = {
      schedule: {
        repeatFrequency,
        startDate: formatISO(startDate),
        byDay,
        byMonth,
      },
      match: {
        index,
        length: text.length,
        text,
      },
    }
    return output
  }
  return null
}
