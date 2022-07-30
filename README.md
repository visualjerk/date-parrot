# morgen.js

morgen.js parses natural language into a [unified schedule object](https://schema.org/Schedule).

**This package is in a very early stage and not yet production ready.**

## Installation

```sh
npm install @visualjerk/morgen
```

## Usage

```ts
import { parse } from 'morgen'

parse('every second day')

// =>
// {
//   schedule: {
//     repeatFrequency: 'P2D',
//     startDate: '[NOW_AS_ISO_STRING]',
//   },
//   match: {
//     index: 0,
//     length: 16,
//     text: 'every second day',
//   },
// }
```

```ts
import { parse } from 'morgen'

parse('eat donuts on every 3rd friday')

// =>
// {
//   schedule: {
//     repeatFrequency: 'P1W',
//     startDate: '[NEXT_FRIDAY_AS_ISO_STRING]',
//   },
//   match: {
//     index: 11,
//     length: 16,
//     text: 'every 3rd friday',
//   },
// }
```
