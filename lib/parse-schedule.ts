import {
  setDate,
  setMonth,
  addYears,
  isPast,
  formatISO,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns'
import { DayOfWeek, Month, ParserConfig } from './types'
import { locales, LocaleConfig } from './locales'
import {
  onSingleWordMatch,
  getNextDayOccurrence,
  parsePhrase,
  phraseBuilder,
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

function parseWithLocale(
  input: string,
  localeConfig: LocaleConfig
): ParseScheduleResult | null {
  const { SCHEDULE_SINGLE_WORDS } = localeConfig

  let repeatFrequency: string | undefined
  let index = 0
  let text = ''
  let byDay: DayOfWeek | undefined
  let byMonth: Month | undefined
  let startDate = new Date()

  function createResult(): ParseScheduleResult | null {
    if (!repeatFrequency) {
      return null
    }
    return {
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
  }

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

  if (singleWordMatch) {
    return createResult()
  }

  const pb = phraseBuilder(localeConfig)
  const phraseRegex =
    `(${pb.time(2)} )?` +
    `${pb.scheduleTrigger()} ` +
    `(` +
    `${pb.integer()} |` +
    `${pb.integerWord()} ` +
    `)?` +
    `(` +
    `${pb.unit()}|` +
    `${pb.weekday()}|` +
    `${pb.month()})` +
    `( ${pb.time(1)})?`

  const result = parsePhrase(input, phraseRegex, localeConfig)

  if (result) {
    index = result.index
    text = result.text

    const { hours, minutes, seconds, integer, unit, weekday, month } = result

    if (hours != null && minutes != null && seconds != null) {
      startDate = setHours(startDate, hours)
      startDate = setMinutes(startDate, minutes)
      startDate = setSeconds(startDate, seconds)
    }

    const ordinal = integer || 1

    if (unit) {
      repeatFrequency = `P${ordinal}${unit}`
    } else if (weekday != null) {
      repeatFrequency = `P${ordinal}W`
      byDay = weekday
      startDate = getNextDayOccurrence(startDate, byDay)
    } else if (month != null) {
      repeatFrequency = `P1Y`
      byMonth = month
      startDate = setDate(setMonth(startDate, byMonth - 1), ordinal)
      if (isPast(startDate)) {
        startDate = addYears(startDate, 1)
      }
    }

    return createResult()
  }

  return null
}

export function parseSchedule(
  input: string,
  config: ParserConfig = { locales: ['en'] }
): ParseScheduleResult | null {
  if (!input) {
    return null
  }

  const localeConfigs = config.locales.map((key) => locales[key])

  for (const localeConfig of localeConfigs) {
    const result = parseWithLocale(input, localeConfig)
    if (result) {
      return result
    }
  }
  return null
}
