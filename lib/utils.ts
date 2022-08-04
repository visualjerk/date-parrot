import {
  addWeeks,
  addYears,
  isBefore,
  isPast,
  setDay,
  setMonth,
} from 'date-fns'
import { LocaleConfig } from './locales'
import { EnumDef, RegExpExecArrayWithGroups, StringDef } from './types'

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
        // Later on we can use (?<=^|\\s) as the boundary for the start of a word
        // Word boundary \b is no option, as it does not match umlauts (e.g. "ü,ö")
        if (match[0][0].match(/\s/)) {
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

export const TRIGGER_BOUNDARY = '(?:^|\\s)'
export const CLOSING_BOUNDARY = '(?=$|[\\s.,;:!?])'

// TODO: get date matcher from https://digitalfortress.tech/tips/top-15-commonly-used-regex/
export const TIME_REGEX =
  '(?:[01]\\d|2[0123])(:(?:[012345]\\d))?(:(?:[012345]\\d))?'

export const onSingleWordMatch = buildWordMatcher(
  (word) => new RegExp(`${TRIGGER_BOUNDARY}${word}${CLOSING_BOUNDARY}`, 'i')
)
export const onTriggerWordMatch = buildWordMatcher(
  (word) => new RegExp(`${TRIGGER_BOUNDARY}${word} `, 'i')
)
export const onMiddleWordMatch = buildWordMatcher(
  (word) => new RegExp(`^${word} `, 'i')
)
export const onClosingWordMatch = buildWordMatcher(
  (word) => new RegExp(`^${word}${CLOSING_BOUNDARY}`, 'i')
)

/**
 * Get the next occurrence of a day today or in the future
 *
 * @param date The reference date to start from
 * @param day The number of the week day
 */
export function getNextDayOccurrence(date: Date, day: number): Date {
  let result = setDay(date, day, { weekStartsOn: 1 })
  if (isBefore(result, date) || isPast(result)) {
    result = addWeeks(result, 1)
  }
  return result
}

/**
 * Get the next occurrence of a month now or in the future
 *
 * @param date The reference date to start from
 * @param month The number of the month
 */
export function getNextMonthOccurrence(date: Date, month: number): Date {
  let result = setMonth(date, month)
  if (isBefore(result, date) || isPast(result)) {
    result = addYears(result, 1)
  }
  return result
}

export function getWordValue<TWord extends EnumDef | StringDef>(
  words: TWord[],
  matchWord: string
): TWord[1] {
  // TODO: This is pretty hacky ... maybe dont allow regex in words
  return words
    .filter(([word]) => matchWord.match(new RegExp(`${word}`, 'i')))
    .sort((a, b) => b[0].length - a[0].length)[0][1]
}

export function createWordRegex(words: EnumDef[] | StringDef[]): string {
  return words.map(([word]) => word).join('|')
}

/**
 * Returns result of the highest priority match for a given group name
 *
 * @example
 * If there are two groups "time1" and "time2" and both have
 * matches, the result will be the match of "time1"
 */
function getHighestPrioGroupMatch(
  groups: Record<string, string>,
  groupName: string
): string | null {
  const groupRegex = new RegExp(`^${groupName}(\\d+)?$`)
  const result = Object.entries(groups)
    .filter(([key, value]) => key.match(groupRegex) && value != null)
    .sort(([keyA], [keyB]) => {
      const aOrder = parseInt(keyA.replace(groupName, ''))
      const bOrder = parseInt(keyB.replace(groupName, ''))
      if (aOrder === NaN) {
        return 1
      }
      if (bOrder === NaN) {
        return -1
      }
      return aOrder - bOrder
    })
  return result[0]?.[1]
}

export interface ParsePhraseResult {
  index: number
  text: string
  integer?: number
  hours?: number
  minutes?: number
  seconds?: number
  unit?: string
  weekday?: number
  month?: number
  next?: boolean
}

export function parsePhrase(
  input: string,
  phraseRegex: string,
  localeConfig: LocaleConfig
): ParsePhraseResult | null {
  const { DAY_OF_WEEK_WORDS, MONTH_WORDS, INTEGER_WORDS, UNIT_WORDS } =
    localeConfig

  const regexString = `${TRIGGER_BOUNDARY}${phraseRegex}${CLOSING_BOUNDARY}`
  const regex = new RegExp(regexString, 'gi')
  const match = regex.exec(input) as RegExpExecArrayWithGroups<{
    nextword?: string
    timepre?: string
    integer?: string
    integerword?: string
    unit?: string
    weekday?: string
    month?: string
    timepost?: string
  }>

  if (!match) {
    return null
  }

  const result: ParsePhraseResult = {
    index: match.index,
    text: match[0],
  }

  // Needed as long as lookbehind is not supported by all browsers
  // Later on we can use (?<=^|\\s) as the boundary for the start of a phrase
  // Word boundary \b is no option, as it does not match umlauts (e.g. "ü,ö")
  if (result.text[0].match(/\s/)) {
    result.index++
    result.text = result.text.slice(1)
  }

  const { unit, weekday, month, nextword } = match.groups

  result.next = nextword != null

  const time = getHighestPrioGroupMatch(match.groups, 'time')
  const integer = getHighestPrioGroupMatch(match.groups, 'integer')
  const integerword = getHighestPrioGroupMatch(match.groups, 'integerword')

  if (integer) {
    result.integer = parseInt(integer)
  } else if (integerword) {
    result.integer = getWordValue(INTEGER_WORDS, integerword)
  }

  if (time) {
    const timeParts = time.split(':')
    result.hours = parseInt(timeParts[0])
    result.minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
    result.seconds = timeParts[2] ? parseInt(timeParts[2]) : 0
  }

  if (unit) {
    result.unit = getWordValue(UNIT_WORDS, unit)
  }
  if (weekday) {
    result.weekday = getWordValue(DAY_OF_WEEK_WORDS, weekday)
  }
  if (month) {
    result.month = getWordValue(MONTH_WORDS, month)
  }

  return result
}

const createPhrasePattern =
  (groupName: string, regex: string) => (index?: number) =>
    regex.replace('<$1>', `<${groupName}${index ? index : ''}>`)

export function phraseBuilder(localeConfig: LocaleConfig) {
  const {
    SCHEDULE_TRIGGER_WORDS,
    DATE_NEXT_TRIGGER_WORDS,
    DAY_OF_WEEK_WORDS,
    MONTH_WORDS,
    INTEGER_SUFFIX,
    INTEGER_WORDS,
    UNIT_WORDS,
    TIME_TRIGGER,
  } = localeConfig

  return {
    scheduleTrigger: createPhrasePattern(
      'schedulword',
      `(?:${SCHEDULE_TRIGGER_WORDS.join('|')})`
    ),
    nextWord: createPhrasePattern(
      'nextword',
      `(?<$1>${DATE_NEXT_TRIGGER_WORDS.join('|')})`
    ),
    integer: createPhrasePattern(
      'integer',
      `(?<$1>\\d+)(?:${INTEGER_SUFFIX}|\\.)?`
    ),
    integerWord: createPhrasePattern(
      'integerword',
      `(?<$1>${createWordRegex(INTEGER_WORDS)})`
    ),
    unit: createPhrasePattern('unit', `(?<$1>${createWordRegex(UNIT_WORDS)})`),
    weekday: createPhrasePattern(
      'weekday',
      `(?<$1>${createWordRegex(DAY_OF_WEEK_WORDS)})`
    ),
    month: createPhrasePattern(
      'month',
      `(?<$1>${createWordRegex(MONTH_WORDS)})`
    ),
    time: createPhrasePattern(
      'time',
      `(?:(${TIME_TRIGGER}) )?(?<$1>${TIME_REGEX})`
    ),
  }
}
