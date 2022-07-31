import { addDays, addMonths, formatISO, setDate } from 'date-fns'
import { LocaleConfig, locales } from './locales'
import { ParserConfig } from './types'
import {
  onSingleWordMatch,
  getNextDayOccurrence,
  getNextMonthOccurrence,
  onTriggerWordMatch,
  onClosingWordMatch,
} from './utils'

/**
 * https://schema.org/Schedule
 */
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
  const {
    SINGLE_DAY_WORDS,
    DAY_OF_WEEK_WORDS,
    DATE_NEXT_TRIGGER_WORDS,
    MONTH_WORDS,
  } = localeConfig

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

  // See if we have a single week day like "monday"
  const nextTriggerWordMatch = onTriggerWordMatch(
    DATE_NEXT_TRIGGER_WORDS,
    input,
    (matchIndex, matchText) => {
      index = matchIndex
      text = matchText
      input = input.substring(index + text.length)
    }
  )

  const onMatch = nextTriggerWordMatch ? onClosingWordMatch : onSingleWordMatch

  // See if we have a single week day like "monday"
  const weekDayMatch = onMatch(
    DAY_OF_WEEK_WORDS,
    input,
    (matchIndex, matchText, value) => {
      if (nextTriggerWordMatch) {
        date = addDays(date, 1)
      }
      index = index == null ? matchIndex : index
      text = `${text}${matchText}`
      date = getNextDayOccurrence(date, value)
    }
  )

  if (weekDayMatch) {
    return createReturn()
  }

  // See if we have a single month like "june"
  const monthMatch = onMatch(
    MONTH_WORDS,
    input,
    (matchIndex, matchText, value) => {
      index = index == null ? matchIndex : index
      text = `${text}${matchText}`
      date = setDate(date, 1)
      date = getNextMonthOccurrence(date, value - 1)
    }
  )

  if (monthMatch) {
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
