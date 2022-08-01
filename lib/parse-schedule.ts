import { setDate, setMonth, addYears, isPast, formatISO } from 'date-fns'
import { DayOfWeek, Month, ParserConfig } from './types'
import { locales, LocaleConfig } from './locales'
import {
  onSingleWordMatch,
  onTriggerWordMatch,
  onMiddleWordMatch,
  onClosingWordMatch,
  getNextDayOccurrence,
  TRIGGER_BOUNDARY,
  CLOSING_BOUNDARY,
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
  const {
    DAY_OF_WEEK_WORDS,
    MONTH_WORDS,
    SCHEDULE_TRIGGER_WORDS,
    SCHEDULE_SINGLE_WORDS,
    ENUM_WORDS,
    UNIT_WORDS,
    ENUM_SUFFIX,
  } = localeConfig

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

  const regexString =
    `${TRIGGER_BOUNDARY}` +
    `(?:${SCHEDULE_TRIGGER_WORDS.join('|')}) ` +
    `(` +
    `(?<enum>\\d+)(?:${ENUM_SUFFIX}|\\.)? |` +
    `(?<enumword>${ENUM_WORDS.map(([word]) => word).join('|')}) ` +
    `)?` +
    `(` +
    `(?<unit>${UNIT_WORDS.map(([word]) => word).join('|')})|` +
    `(?<weekday>${DAY_OF_WEEK_WORDS.map(([word]) => word).join('|')})|` +
    `(?<month>${MONTH_WORDS.map(([word]) => word).join('|')})` +
    `)` +
    `${CLOSING_BOUNDARY}`
  const regex = new RegExp(regexString, 'gi')
  const result = regex.exec(input)

  function getWordValue(words, matchWord) {
    return words.find(([word]) =>
      word.match(new RegExp(`${matchWord}`, 'i'))
    )[1]
  }

  if (result) {
    index = result.index
    text = result[0]

    if (text[0].match(/\s/)) {
      index++
      text = text.slice(1)
    }

    const enumMatch = result.groups.enum
    const enumWordMatch = result.groups.enumword
    const unitMatch = result.groups.unit
    const weekdayMatch = result.groups.weekday
    const monthMatch = result.groups.month

    let ordinal = 1
    if (enumMatch) {
      ordinal = enumMatch
    } else if (enumWordMatch) {
      ordinal = getWordValue(ENUM_WORDS, enumWordMatch)
    }

    if (unitMatch) {
      const unit = getWordValue(UNIT_WORDS, unitMatch)
      repeatFrequency = `P${ordinal}${unit}`
    } else if (weekdayMatch) {
      repeatFrequency = `P${ordinal}W`
      byDay = getWordValue(DAY_OF_WEEK_WORDS, weekdayMatch)
      startDate = getNextDayOccurrence(startDate, byDay)
    } else if (monthMatch) {
      repeatFrequency = `P1Y`
      byMonth = getWordValue(MONTH_WORDS, monthMatch)
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
