import { en } from './en'
import { de } from './de'

export const locales = {
  en,
  de,
}

export type LocaleConfig = typeof locales[keyof typeof locales]
