import { EnumDef, StringDef } from './constants'

export function onSingleWordMatch<TDef extends EnumDef | StringDef>(
  wordDefs: TDef[],
  input: string,
  onMatch: (index: number, text: string, value: TDef[1]) => void
): boolean {
  return wordDefs.some(([word, value]) => {
    const match = input.match(
      new RegExp(`^${word} +| ${word} +| ${word}$|^${word}$`, 'i')
    )
    if (match && match[0]) {
      let index = match.index || 0
      if (match[0].at(0) === ' ') {
        index++
      }
      match[0] = match[0].trim()
      const text = match[0]
      onMatch(index, text, value)
      return true
    }
    return false
  })
}
