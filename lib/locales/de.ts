import { EnumDef, StringDef } from '../types'

const DAY_OF_WEEK_WORDS: EnumDef[] = [
  ['sonntag', 0],
  ['montag', 1],
  ['dienstag', 2],
  ['mittwoch', 3],
  ['donnerstag', 4],
  ['freitag', 5],
  ['samstag', 6],
]

const MONTH_WORDS: EnumDef[] = [
  ['januar', 1],
  ['februar', 2],
  ['märz', 3],
  ['april', 4],
  ['mai', 5],
  ['juni', 6],
  ['juli', 7],
  ['august', 8],
  ['september', 9],
  ['oktober', 10],
  ['november', 11],
  ['dezember', 12],
]

const SCHEDULE_SINGLE_WORDS: StringDef[] = [
  ['täglich', '1D'],
  ['wöchentlich', '1W'],
  ['monatlich', '1M'],
  ['jährlich', '1Y'],
]

const SCHEDULE_TRIGGER_WORDS = ['jede[rn]?', 'alle']
const DATE_NEXT_TRIGGER_WORDS = ['nächste[rn]?', 'kommende[rn]?']

const SINGLE_DAY_WORDS: EnumDef[] = [
  ['heute', 0],
  ['morgen', 1],
  ['übermorgen', 2],
  ['gestern', -1],
]

const ENUM_SUFFIX = 'ter?'

const ENUM_WORDS: EnumDef[] = [
  ['erste[rn]?', 1],
  ['zweite[rn]?', 2],
  ['dritte[rn]?', 3],
  ['vierte[rn]?', 4],
  ['fünfte[rn]?', 5],
  ['sexte[rn]?', 6],
  ['siebte[rn]?', 7],
  ['achte[rn]?', 8],
  ['neunte[rn]?', 9],
  ['zehnte[rn]?', 10],
  //
  ['eins', 1],
  ['zwei', 2],
  ['drei', 3],
  ['vier', 4],
  ['fünf', 5],
  ['sechs', 6],
  ['sieben', 7],
  ['acht', 8],
  ['neun', 9],
  ['zehn', 10],
  ['elf', 11],
  ['zwölf', 12],
  ['dreizehn', 13],
  ['vierzehn', 14],
  ['fünfzehn', 15],
  ['sechzehn', 16],
  ['siebzehn', 17],
  ['achtzehn', 18],
  ['neunzehn', 19],
  ['zwanzig', 20],
  ['einundzwanzig', 21],
  ['zweiundzwanzig', 22],
  ['dreinundzwanzig', 23],
  ['vierundzwanzig', 24],
  ['fünfundzwanzig', 25],
  ['sechsundzwanzig', 26],
  ['siebenundzwanzig', 27],
  ['achtundzwanzig', 28],
  ['neunundzwanzig', 29],
  ['dreissig', 30],
  ['dreißig', 30],
]

const UNIT_WORDS: StringDef[] = [
  ['sekunden?', 's'],
  ['minuten?', 'm'],
  ['stunden?', 'h'],
  ['tag[e|en]?', 'D'],
  ['wochen?', 'W'],
  ['monat[e|en]?', 'M'],
  ['jahr[e|en]?', 'Y'],
]

export const de = {
  DAY_OF_WEEK_WORDS,
  MONTH_WORDS,
  SCHEDULE_SINGLE_WORDS,
  SCHEDULE_TRIGGER_WORDS,
  DATE_NEXT_TRIGGER_WORDS,
  SINGLE_DAY_WORDS,
  ENUM_SUFFIX,
  ENUM_WORDS,
  UNIT_WORDS,
}
