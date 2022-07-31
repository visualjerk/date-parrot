<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseSchedule, parseDate, ParserConfig } from '../../lib'

interface InputPart {
  value: string
  isSchedule?: boolean
  isDate?: boolean
}

const localeChoices = ['en', 'de'] as const
const selectedLocales = ref<ParserConfig['locales']>(['en'])
function localeIsActive(locale: 'de' | 'en') {
  return selectedLocales.value.includes(locale)
}
function toggleLocale(locale: 'de' | 'en') {
  const index = selectedLocales.value.indexOf(locale)
  if (index === -1) {
    selectedLocales.value.push(locale)
  } else {
    selectedLocales.value.splice(index, 1)
  }
}
const config = computed<ParserConfig>(() => ({
  locales: selectedLocales.value,
}))
const text = ref('I eat pizza every second friday')
const parsedSchedule = computed(() => parseSchedule(text.value, config.value))
const parsedDate = computed(() => parseDate(text.value, config.value))

const textParts = computed(() => {
  const value = text.value
  const schedule = parsedSchedule.value
  const date = parsedDate.value
  const match = (schedule && schedule.match) || (date && date.match)
  if (!match) {
    return [
      {
        value,
      },
    ]
  }

  const parts: InputPart[] = [
    {
      isSchedule: !!schedule,
      isDate: !!date,
      value: match.text,
    },
  ]
  if (match.index > 0) {
    parts.unshift({
      value: value.slice(0, match.index),
    })
  }
  const endIndex = match.index + match.text.length
  if (value.length > endIndex) {
    parts.push({
      value: value.slice(endIndex),
    })
  }
  return parts
})
</script>

<template>
  <div
    class="md:-mx-8 lg:-mx-12 p-6 lg:px-12 lg:py-8 shadow-lg rounded-lg bg-gradient-to-br from-green-50 to-indigo-100 border-4 border-white dark:border-purple-800 dark:from-purple-900 dark:to-indigo-800 dark:shadow-purple-900 text-slate-800"
  >
    <div class="flex justify-end gap-2 mb-4">
      <button
        v-for="locale in localeChoices"
        :key="locale"
        @click="toggleLocale(locale)"
        class="px-2 rounded-full text-white font-bold"
        :class="localeIsActive(locale) ? 'bg-pink-600' : 'bg-purple-400'"
      >
        {{ locale }}
      </button>
    </div>
    <div class="relative mb-6">
      <textarea
        v-model="text"
        class="border border-solid border-white shadow-md bg-slate-50 rounded-lg w-full p-4 text-xl focus:outline focus:outline-4 focus:outline-pink-400 focus:bg-white font-extrabold text-transparent caret-slate-800 absolute inset-0 resize-none"
        rows="1"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        autocomplete="off"
      />
      <div
        class="border border-transparent pointer-events-none p-4 text-xl font-extrabold whitespace-pre-wrap text-slate-700 relative"
      >
        <span
          v-for="part in textParts"
          :class="(part.isSchedule || part.isDate) && 'text-pink-500'"
        >
          {{ part.value }}
        </span>
        &nbsp;
      </div>
    </div>
    <div class="language-ts">
      <pre><code>{{ parsedSchedule || parsedDate || 'null' }}</code></pre>
    </div>
  </div>
</template>
