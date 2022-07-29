export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

/**
 * https://schema.org/Schedule
 */
export interface ParseResult {
  schedule: {
    byDay?: DayOfWeek
    byMonth?: number
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

type ENUM_DEF = [string, number]
type STRING_DEF = [string, string]

const SCHEDULE_TRIGGER_WORDS = ['every', 'each']
const ENUM_WORDS: ENUM_DEF[] = [
  ['second', 2],
  ['third', 3],
]
const UNIT_WORDS: STRING_DEF[] = [
  ['day', 'D'],
  ['week', 'W'],
]

export function parse(input: string): ParseResult | null {
  let repeatFrequency: string | undefined

  let index = 0
  let text = ''
  const scheduleTriggerMatch = SCHEDULE_TRIGGER_WORDS.some((word) => {
    const match = input.match(new RegExp(`^${word} +| ${word} +`))
    if (match && match[0]) {
      index = match.index || 0
      if (match[0].at(0) === ' ') {
        index++
        match[0] = match[0].trimStart()
      }

      text = match[0]
      input = input.slice(index + match[0].length)
      return true
    }
    return false
  })
  if (!scheduleTriggerMatch) {
    return null
  }

  const enumWordMatch = ENUM_WORDS.some(([word, value]) => {
    const match = input.match(new RegExp(`^${word} +`))
    if (match && match[0]) {
      repeatFrequency = `P${value}`
      text = `${text}${match[0]}`
      input = input.slice(match[0].length)
      return true
    }
    return false
  })
  if (!enumWordMatch) {
    repeatFrequency = 'P1'
  }

  const unitWordMatch = UNIT_WORDS.some(([word, unit]) => {
    const match = input.match(new RegExp(`^${word}$|^${word} `))
    if (match && match[0]) {
      repeatFrequency = `${repeatFrequency}${unit}`
      if (match[0].at(-1) === ' ') {
        match[0] = match[0].trimEnd()
      }
      text = `${text}${match[0]}`
      return true
    }
    return false
  })
  if (!unitWordMatch) {
    return null
  }

  if (!repeatFrequency) {
    return null
  }

  const output: ParseResult = {
    schedule: {
      repeatFrequency,
      startDate: new Date('2022-01-01').toISOString(),
    },
    match: {
      index,
      length: text.length,
      text,
    },
  }
  return output
}
