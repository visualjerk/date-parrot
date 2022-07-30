import { addDays, formatISO } from 'date-fns'
import { locales } from './locales'
import { ParserConfig } from './types'
import { onSingleWordMatch } from './utils'

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

export function parseDate(
  input: string,
  config: ParserConfig = { locales: ['en'] }
): ParseDateResult | null {
  if (!input) {
    return null
  }

  const localeConfigs = config.locales.map((key) => locales[key])

  for (const config of localeConfigs) {
    const { SINGLE_DAY_WORDS } = config

    let date = new Date()
    let index = 0
    let text = ''

    // See if we have a single word
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
      const output: ParseDateResult = {
        date: formatISO(date),
        match: {
          index,
          length: text.length,
          text,
        },
      }
      return output
    }
  }
  return null
}
