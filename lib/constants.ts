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

type ENUM_DEF = [string, number]
type STRING_DEF = [string, string]

export const SINGLE_DAY_WORDS: ENUM_DEF[] = [
  ['today', 0],
  ['tomorrow', 1],
  ['yesterday', -1],
]

export const ENUM_WORDS: ENUM_DEF[] = [
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

export const UNIT_WORDS: STRING_DEF[] = [
  ['second', 's'],
  ['minute', 'm'],
  ['hour', 'h'],
  ['day', 'D'],
  ['week', 'W'],
  ['month', 'M'],
  ['year', 'Y'],
]
