# DateParrot

DateParrot parses natural language into a [unified schedule object](https://schema.org/Schedule) or ISO date.

**This package is in a very early stage and not yet production ready.**

## Installation

```sh
npm install date-parrot
```

## Usage

```ts
import { parseDate } from 'date-parrot'

parseDate('lets go out tomorrow')

// =>
// {
//   date: [TOMORROW_AS_ISO_STRING],
//   match: {
//     index: 12,
//     length: 8,
//     text: 'tomorrow',
//   },
// }
```

```ts
import { parseSchedule } from 'date-parrot'

parseSchedule('every second day')

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
import { parseSchedule } from 'date-parrot'

parseSchedule('eat donuts on every 3rd friday')

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
