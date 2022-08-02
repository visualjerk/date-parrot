import type { locales } from './locales'

export type RegExpExecArrayWithGroups<T> =
  | (RegExpExecArray & { groups: T })
  | null

export type EnumDef = [string, number]
export type StringDef = [string, string]

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

export interface ParserConfig {
  locales: (keyof typeof locales)[]
}
