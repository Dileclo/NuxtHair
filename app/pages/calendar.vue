<template>
  <div>
    <VueCal class="h-full" sm locale="ru" :today-button="false" :time-from="7 * 60" :time-to="21 * 60" :time-step="30"
      :views="['day', 'week', 'year']" :snap-to-interval="30" editable-events @event-create="createEvent" />
  </div>

  <USlideover v-model:open="open" title="Запись клиента">
    <template #body>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Клиент" name="clientId">
          <UInputMenu v-model="state.clientId" :items="clientItems" option-attribute="label" value-attribute="value"
            placeholder="Выберите клиента" />
        </UFormField>

        <UFormField label="Время начала работы" name="start">
          <UInput v-model="state.start" type="time" />
        </UFormField>
        <UFormField label="Время окончания работы" name="start">
          <UInput v-model="state.start" type="time" />
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
import { VueCal } from 'vue-cal'
import 'vue-cal/style'

const clientStore = useClientsStore()
const open = ref(false)

const state = reactive({
  clientId: '',
  start: '',
  end: '',
  color: '',
  note: ''
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
  open.value = true
}

onMounted(() => clientStore.fetchClients())

function onSubmit() {
  // здесь у тебя есть state.clientId, state.phone, state.note
}
</script>
