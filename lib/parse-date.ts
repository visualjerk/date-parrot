import { addDays, formatISO } from 'date-fns'
import { SINGLE_DAY_WORDS } from './constants'

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
  const singleWordMatch = SINGLE_DAY_WORDS.some(([word, value]) => {
    const match = input.match(
      new RegExp(`^${word} +| ${word} +| ${word}$|^${word}$`, 'i')
    )
    if (match && match[0]) {
      index = match.index || 0
      if (match[0].at(0) === ' ') {
        index++
      }
      match[0] = match[0].trim()
      text = match[0]
      date = addDays(date, value)
      return true
    }
    return false
  })
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
