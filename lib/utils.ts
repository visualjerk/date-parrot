import { addWeeks, isBefore, setDay } from 'date-fns'
import { EnumDef, StringDef } from './types'

type TValue<TDef extends EnumDef | StringDef | string> = TDef extends string
  ? TDef
  : TDef[1]

export const buildWordMatcher = (regexBuilder: (word: string) => RegExp) =>
  function <TDef extends EnumDef | StringDef | string>(
    wordDefs: TDef[],
    input: string,
    onMatch: (index: number, text: string, value: TValue<TDef>) => void
  ): boolean {
    return wordDefs.some((definition) => {
      const word = typeof definition === 'string' ? definition : definition[0]
      const value = typeof definition === 'string' ? definition : definition[1]

      const match = input.match(regexBuilder(word))
      if (match && match[0]) {
        let index = match.index || 0
        let text = match[0]
        // Needed as long as lookbehind is not supported by all browsers
        // Later on we can use (?<=^| ) as the boundary for the start of a word
        // Word boundary \b is no option, as it does not match umlauts (e.g. "ü,ö")
        if (match[0].startsWith(' ')) {
          index++
          text = text.slice(1)
        }
        // The type guard above ensures this is a string or the value of definition
        onMatch(index, text, value as TValue<TDef>)
        return true
      }
      return false
    })
  }

const triggerBoundary = '(?:^| )'
const closingBoundary = '(?=$|[ .,;:!?])'

export const onSingleWordMatch = buildWordMatcher(
  (word) => new RegExp(`${triggerBoundary}${word}${closingBoundary}`, 'i')
)
export const onTriggerWordMatch = buildWordMatcher(
  (word) => new RegExp(`${triggerBoundary}${word} `, 'i')
)
export const onMiddleWordMatch = buildWordMatcher(
  (word) => new RegExp(`^${word} `, 'i')
)
export const onClosingWordMatch = buildWordMatcher(
  (word) => new RegExp(`^${word}${closingBoundary}`, 'i')
)

/**
 * Get the next occurrence of a day today or in the future
 *
 * @param date The reference date to start from
 * @param day The number of the week day
 */
export function getNextDayOccurrence(date: Date, day: number): Date {
  let result = setDay(date, day, { weekStartsOn: 1 })
  if (isBefore(result, date)) {
    result = addWeeks(result, 1)
  }
  return result
}
