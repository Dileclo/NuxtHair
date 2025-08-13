<template>
  <div>
    <VueCal class="h-full" sm locale="ru" v-model:events="appointmentStore.events" :today-button="false"
      :time-from="7 * 60" :time-to="21 * 60" :time-step="30" :views="['day', 'week', 'year']" :snap-to-interval="30"
      editable-events @event-create="createEvent">
      <template #event="{ event }">
        <div class="px-1 py-0.5 text-xs">
          <div class="font-medium truncate">{{ event.clientId.label || 'Запись' }}</div>
          <div class="opacity-70 truncate" v-if="event.service || event.price">
            {{ event.service }} <span v-if="event.price">· {{ event.price }}</span>
          </div>
        </div>
      </template>
    </VueCal>
  </div>
  {{ appointmentStore.events }}

  <USlideover v-model:open="open" title="Запись клиента">
    <template #body>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Клиент" name="clientId">
          <UInputMenu v-model="state.clientId" :items="clientItems" option-attribute="label" value-attribute="value"
            placeholder="Выберите клиента" />
        </UFormField>
        <UFormField label="Услуга" name="service">
          <UInputMenu v-model="state.service" :items="clientItems" option-attribute="label" value-attribute="value"
            placeholder="Выберите клиента" />
        </UFormField>

        <UFormField label="Цена" name="price">
          <UInput v-model="state.price" type="number" />
        </UFormField>
        <UFormField label="Время начала работы" name="start">
          <UInput v-model="state.start" type="datetime-local" />
        </UFormField>
        <UFormField label="Время окончания работы" name="end">
          <UInput v-model="state.end" type="datetime-local" />
        </UFormField>

        <UFormField label="Примечание" name="note">
          <UInput v-model="state.note" />
        </UFormField>

        <UButton type="submit">Добавить</UButton>
      </UForm>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

import { VueCal } from 'vue-cal'
import 'vue-cal/style'

const clientStore = useClientsStore()
const appointmentStore = useAppointmentsStore()

const open = ref(false)
const toast = useToast()
const state = reactive({
  clientId: '',
  start: '',
  end: '',
  service: '',
  color: '',
  note: '',
  price: ''
})

const clientItems = computed(() =>
  clientStore.clients.map((c: any) => ({
    label: c.name || '(без имени)',
    value: c._id
  }))
)

const selectedClient = computed(() =>
  clientStore.clients.find((c: any) => c._id === state.clientId) || null
)

// авто-подстановка телефона при выборе клиента (по желанию)
watch(() => state.client, (c) => {
  state.phone = String(c?.phone ?? '')
})

function createEvent({ event, resolve }) {
  state.start = toLocalInput(event.start)
  state.end = toLocalInput(event.end)
  open.value = true
}

onMounted(async () => {
  await clientStore.fetchClients()
  await appointmentStore.fetchEvents()
})

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  const startDate = fromLocalInput(state.start)
  const endDate = fromLocalInput(state.end)

  const startISO = startDate.toISOString()
  const endISO = endDate.toISOString()

  await appointmentStore.addEvent({
    clientId: state.clientId, // <-- без .value
    start: startISO,
    end: endISO,
    note: state.note,
    color: state.color,
    price: state.price,
    service: state.service,
    title: selectedClient.value?.name
  })

  open.value = false
  toast.add({ title: 'Запись успешно добавлена', color: 'success' })
}

const pad = (n: number) => String(n).padStart(2, '0')

// Date -> "YYYY-MM-DDTHH:MM" (для v-model datetime-local)
function toLocalInput(d: Date) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${y}-${m}-${day}T${hh}:${mm}`
}

// "YYYY-MM-DDTHH:MM" -> Date (локальное время)
function fromLocalInput(s: string) {
  const [date, time] = s.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = (time ?? '00:00').split(':').map(Number)
  return new Date(y, (m - 1), d, hh, mm)
}

</script>
