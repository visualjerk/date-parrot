import { EnumDef, StringDef } from '../types'

export const DAY_OF_WEEK_WORDS: EnumDef[] = [
  ['sunday', 0],
  ['monday', 1],
  ['tuesday', 2],
  ['wednesday', 3],
  ['thursday', 4],
  ['friday', 5],
  ['saturday', 6],
]

export const MONTH_WORDS: EnumDef[] = [
  ['january', 1],
  ['february', 2],
  ['march', 3],
  ['april', 4],
  ['may', 5],
  ['june', 6],
  ['july', 7],
  ['august', 8],
  ['september', 9],
  ['october', 10],
  ['november', 11],
  ['december', 12],
]

export const SCHEDULE_SINGLE_WORDS: StringDef[] = [
  ['everyday', '1D'],
  ['daily', '1D'],
  ['weekly', '1W'],
  ['monthly', '1M'],
  ['yearly', '1Y'],
]
export const SCHEDULE_TRIGGER_WORDS = ['every', 'each']

export const SINGLE_DAY_WORDS: EnumDef[] = [
  ['today', 0],
  ['tomorrow', 1],
  ['yesterday', -1],
]

export const ENUM_SUFFIX = 'th'

export const ENUM_WORDS: EnumDef[] = [
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

export const UNIT_WORDS: StringDef[] = [
  ['seconds?', 's'],
  ['minutes?', 'm'],
  ['hours?', 'h'],
  ['days?', 'D'],
  ['weeks?', 'W'],
  ['months?', 'M'],
  ['years?', 'Y'],
]

export const en = {
  DAY_OF_WEEK_WORDS,
  MONTH_WORDS,
  SCHEDULE_SINGLE_WORDS,
  SCHEDULE_TRIGGER_WORDS,
  SINGLE_DAY_WORDS,
  ENUM_SUFFIX,
  ENUM_WORDS,
  UNIT_WORDS,
}
