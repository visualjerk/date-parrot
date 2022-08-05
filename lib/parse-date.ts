import {
  addDays,
  formatISO,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns'
import { LocaleConfig, locales } from './locales'
import { ParserConfig } from './types'
import {
  onSingleWordMatch,
  getNextDayOccurrence,
  getNextMonthOccurrence,
  parsePhrase,
  phraseBuilder,
} from './utils'

export interface ParseDateResult {
  date: string
  match: {
    index: number
    length: number
    text: string
  }
}

function parseWithLocale(
  input: string,
  localeConfig: LocaleConfig
): ParseDateResult | null {
  const { SINGLE_DAY_WORDS } = localeConfig

  let date = new Date()
  let index: number | undefined
  let text = ''

  function createReturn(): ParseDateResult | null {
    if (index == null) {
      return null
    }
    return {
      date: formatISO(date),
      match: {
        index,
        length: text.length,
        text,
      },
    }
  }

  // See if we have a single word like "today"
  const singleWordMatch = onSingleWordMatch(
    SINGLE_DAY_WORDS,
    input,
    (matchIndex, matchText, value) => {
      index = matchIndex
      text = matchText
      date = addDays(date, value)
    }
  )

  if (singleWordMatch) {
    return createReturn()
  }

  const pb = phraseBuilder(localeConfig)
  const phraseRegex =
    `(${pb.time(2)} )?` +
    `(` +
    `${pb.nextWord()} |` +
    `${pb.integer(2)} |` +
    `${pb.integerWord(2)} ` +
    `)?` +
    `(` +
    `${pb.weekday()}|` +
    `${pb.month()}` +
    `)` +
    `(` +
    ` ${pb.integer(1)}|` +
    ` ${pb.integerWord(1)}` +
    `)?` +
    `( ${pb.time(1)})?`

  const result = parsePhrase(input, phraseRegex, localeConfig)

  if (result) {
    index = result.index
    text = result.text

    const { integer, month, weekday, next, hours, minutes, seconds } = result

    const dayOfMonth = integer || 1

    if (hours != null && minutes != null && seconds != null) {
      date = setHours(date, hours)
      date = setMinutes(date, minutes)
      date = setSeconds(date, seconds)
    }

    if (weekday != null) {
      if (next) {
        date = addDays(date, 1)
      }
      date = getNextDayOccurrence(date, weekday)
    }

    if (month != null) {
      date = setDate(date, dayOfMonth)
      date = getNextMonthOccurrence(date, month - 1)
    }

    return createReturn()
  }

  return null
}

export function parseDate(
  input: string,
  config: ParserConfig = { locales: ['en'] }
): ParseDateResult | null {
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
