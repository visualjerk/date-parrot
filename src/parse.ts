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
  let byDay: DayOfWeek | undefined
  let byMonth: Month | undefined
  let startDate = new Date()

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

  const enumWordMatch = ENUM_WORDS.some(([word, value]) => {
    const match = input.match(new RegExp(`^${word} +`, 'i'))
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
    const match = input.match(new RegExp(`^${word}$|^${word} `, 'i'))
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
