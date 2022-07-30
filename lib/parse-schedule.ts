import {
  setDay,
  setDate,
  setMonth,
  addWeeks,
  addYears,
  isPast,
  formatISO,
} from 'date-fns'
import { DayOfWeek, Month, ENUM_WORDS, UNIT_WORDS } from './constants'

/**
 * https://schema.org/Schedule
 */
export interface ParseScheduleResult {
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

const SCHEDULE_TRIGGER_WORDS = ['every', 'each']

export function parseSchedule(input: string): ParseScheduleResult | null {
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
      if (typeof value === 'string') {
        return false
      }
      const match = input.match(new RegExp(`^${day}$|^${day} `, 'i'))
      if (match && match[0]) {
        repeatFrequency = `${repeatFrequency}W`
        byDay = value
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
        if (typeof value === 'string') {
          return false
        }
        const match = input.match(new RegExp(`^${name}$|^${name} `, 'i'))
        if (match && match[0]) {
          repeatFrequency = `${repeatFrequency}Y`
          byMonth = value
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

  const output: ParseScheduleResult = {
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
