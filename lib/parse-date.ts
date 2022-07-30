import { addDays, formatISO } from 'date-fns'
import { SINGLE_DAY_WORDS } from './constants'
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

export function parseDate(input: string): ParseDateResult | null {
  if (!input) {
    return null
  }
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

  if (!singleWordMatch) {
    return null
  }

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
