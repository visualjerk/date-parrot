import {
  setDay,
  setDate,
  setMonth,
  addWeeks,
  addYears,
  isPast,
  formatISO,
} from 'date-fns'

export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

/**
 * https://schema.org/Schedule
 */
export interface ParseResult {
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

type ENUM_DEF = [string, number]
type STRING_DEF = [string, string]

const SCHEDULE_TRIGGER_WORDS = ['every', 'each']
const ENUM_WORDS: ENUM_DEF[] = [
  ['first', 1],
  ['second', 2],
  ['third', 3],
  ['fourth', 4],
  ['fifth', 5],
  ['sixth', 6],
  ['seventh', 7],
  ['eigth', 8],
  ['nineth', 9],
  ['tenth', 10],
  //
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10],
  ['eleven', 11],
  ['twelve', 12],
  ['thirteen', 13],
  ['fourteen', 14],
  ['fifteen', 15],
  ['sixteen', 16],
  ['seventeen', 17],
  ['eighteen', 18],
  ['nineteen', 19],
  ['twenty', 20],
  ['twentyone', 21],
  ['twentytwo', 22],
  ['twentythree', 23],
  ['twentyfour', 24],
  ['twentyfive', 25],
  ['twentysix', 26],
  ['twentyseven', 27],
  ['twentyeight', 28],
  ['twentynine', 29],
  ['thirty', 30],
  //
  ['1st', 1],
  ['2nd', 2],
  ['3rd', 3],
]
const UNIT_WORDS: STRING_DEF[] = [
  ['second', 's'],
  ['minute', 'm'],
  ['hour', 'h'],
  ['day', 'D'],
  ['week', 'W'],
  ['month', 'M'],
  ['year', 'Y'],
]

export function parse(input: string): ParseResult | null {
  if (!input) {
    return null
  }
  let repeatFrequency: string | undefined
  let index = 0
  let text = ''
  let byDay: DayOfWeek | undefined
  let byMonth: Month | undefined
  let startDate = new Date()

  // See if we have a schedule trigger word
  const scheduleTriggerMatch = SCHEDULE_TRIGGER_WORDS.some((word) => {
    const match = input.match(new RegExp(`^${word} +| ${word} +`, 'i'))
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

  // See if we have a enumaration like "2", "4.", "20th", etc.
  let enumMatch = false
  const match = input.match(new RegExp('^(\\d+)(th|.)? +', 'i'))
  if (match && match[0]) {
    const value = match[1]
    repeatFrequency = `P${value}`
    text = `${text}${match[0]}`
    input = input.slice(match[0].length)
    enumMatch = true
  }

  // See if we have a distinct enum word like "first", "2nd", etc.
  if (!enumMatch) {
    enumMatch = ENUM_WORDS.some(([word, value]) => {
      const match = input.match(new RegExp(`^${word} +`, 'i'))
      if (match && match[0]) {
        repeatFrequency = `P${value}`
        text = `${text}${match[0]}`
        input = input.slice(match[0].length)
        return true
      }
      return false
    })
  }

  // If we dont't have an enum match, the frequency is set to 1
  if (!enumMatch) {
    repeatFrequency = 'P1'
  }

  // See if we have a unit word like "minute", "hour", etc.
  const unitWordMatch = UNIT_WORDS.some(([word, unit]) => {
    const match = input.match(new RegExp(`^${word}s?$|^${word}s? `, 'i'))
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
  // If we don't have a unit word, see if we have a week day
  if (!unitWordMatch) {
    const weekDayMatch = Object.entries(DayOfWeek).some(([day, value]) => {
      const match = input.match(new RegExp(`^${day}$|^${day} `, 'i'))
      if (match && match[0]) {
        repeatFrequency = `${repeatFrequency}W`
        byDay = value as DayOfWeek
        startDate = setDay(startDate, byDay, { weekStartsOn: 1 })
        if (isPast(startDate)) {
          startDate = addWeeks(startDate, 1)
        }
        if (match[0].at(-1) === ' ') {
          match[0] = match[0].trimEnd()
        }
        text = `${text}${match[0]}`
        return true
      }
      return false
    })
    // See if we have a month
    if (!weekDayMatch) {
      const monthMatch = Object.entries(Month).some(([name, value]) => {
        const match = input.match(new RegExp(`^${name}$|^${name} `, 'i'))
        if (match && match[0]) {
          repeatFrequency = `${repeatFrequency}Y`
          byMonth = value as Month
          startDate = setDate(setMonth(startDate, byMonth - 1), 1)
          if (isPast(startDate)) {
            startDate = addYears(startDate, 1)
          }
          if (match[0].at(-1) === ' ') {
            match[0] = match[0].trimEnd()
          }
          text = `${text}${match[0]}`
          return true
        }
        return false
      })
      if (!monthMatch) {
        return null
      }
    }
  }

  if (!repeatFrequency) {
    return null
  }

  const output: ParseResult = {
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
  return output
}
