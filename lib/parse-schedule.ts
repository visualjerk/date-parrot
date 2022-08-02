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
import {
  DayOfWeek,
  Month,
  ParserConfig,
  RegExpExecArrayWithGroups,
} from './types'
import { locales, LocaleConfig } from './locales'
import {
  onSingleWordMatch,
  getNextDayOccurrence,
  TRIGGER_BOUNDARY,
  CLOSING_BOUNDARY,
  TIME_REGEX,
  createWordRegex,
  getWordValue,
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
    INTEGER_WORDS,
    UNIT_WORDS,
    INTEGER_SUFFIX,
    TIME_TRIGGER,
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
    `((?:(${TIME_TRIGGER}) )?(?<timepre>${TIME_REGEX}) )?` +
    `(?:${SCHEDULE_TRIGGER_WORDS.join('|')}) ` +
    `(` +
    `(?<integer>\\d+)(?:${INTEGER_SUFFIX}|\\.)? |` +
    `(?<integerword>${createWordRegex(INTEGER_WORDS)}) ` +
    `)?` +
    `(` +
    `(?<unit>${createWordRegex(UNIT_WORDS)})|` +
    `(?<weekday>${createWordRegex(DAY_OF_WEEK_WORDS)})|` +
    `(?<month>${createWordRegex(MONTH_WORDS)})` +
    `)` +
    `( (?:(${TIME_TRIGGER}) )?(?<timepost>${TIME_REGEX}))?` +
    `${CLOSING_BOUNDARY}`
  const regex = new RegExp(regexString, 'gi')
  const result = regex.exec(input) as RegExpExecArrayWithGroups<{
    timepre?: string
    integer?: string
    integerword?: string
    unit?: string
    weekday?: string
    month?: string
    timepost?: string
  }>

  if (result) {
    index = result.index
    text = result[0]

    if (text[0].match(/\s/)) {
      index++
      text = text.slice(1)
    }

    const { integer, integerword, unit, weekday, month, timepost, timepre } =
      result.groups

    const time = timepost || timepre

    let ordinal = 1
    if (integer) {
      ordinal = parseInt(integer)
    } else if (integerword) {
      ordinal = getWordValue(INTEGER_WORDS, integerword)
    }

    if (time) {
      const timeParts = time.split(':')
      const hours = parseInt(timeParts[0])
      const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
      const seconds = timeParts[2] ? parseInt(timeParts[2]) : 0

      startDate = setHours(startDate, hours)
      startDate = setMinutes(startDate, minutes)
      startDate = setSeconds(startDate, seconds)
    }

    if (unit) {
      const unitAbbreviation = getWordValue(UNIT_WORDS, unit)
      repeatFrequency = `P${ordinal}${unitAbbreviation}`
    } else if (weekday) {
      repeatFrequency = `P${ordinal}W`
      byDay = getWordValue(DAY_OF_WEEK_WORDS, weekday)
      startDate = getNextDayOccurrence(startDate, byDay)
    } else if (month) {
      repeatFrequency = `P1Y`
      byMonth = getWordValue(MONTH_WORDS, month)
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
