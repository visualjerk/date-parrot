<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseSchedule } from '../../lib'

interface InputPart {
  value: string
  isSchedule?: boolean
}

const text = ref('I eat pizza every second friday')
const parsedSchedule = computed(() => parseSchedule(text.value))

const textParts = computed(() => {
  const value = text.value
  const schedule = parseSchedule(value)
  const match = schedule && schedule.match
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
    class="md:-mx-8 lg:-mx-12 p-6 lg:p-12 shadow-lg rounded-lg bg-gradient-to-br from-green-50 to-indigo-100 border-4 border-white dark:border-purple-800 dark:from-purple-900 dark:to-indigo-800 dark:shadow-purple-900 text-slate-800"
  >
    <div class="relative mb-6">
      <input
        v-model="text"
        autofocus
        class="border border-solid border-white shadow-md bg-slate-50 rounded-lg w-full p-4 text-xl focus:outline focus:outline-4 focus:outline-pink-400 focus:bg-white font-extrabold text-transparent caret-slate-800"
      />
      <div
        class="border border-transparent absolute inset-0 pointer-events-none p-4 text-xl font-extrabold whitespace-pre text-slate-700"
      >
        <template v-for="part in textParts">
          <span v-if="part.isSchedule" class="text-pink-500">
            {{ part.value }}
          </span>
          <span v-else>
            {{ part.value }}
          </span>
        </template>
      </div>
    </div>
    <div class="language-ts">
      <pre><code>{{ parsedSchedule || 'null' }}</code></pre>
    </div>
  </div>
</template>
