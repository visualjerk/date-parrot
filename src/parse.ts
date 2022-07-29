export function parse(input: string) {
  const output = {
    schedule: {
      repeatFrequency: 'P1D',
      startDate: new Date('2022-01-01').toISOString(),
    },
    match: {
      index: 0,
      length: input.length,
      text: input,
    },
  }
  return output
}
