<template>
    <USlideover title="Добавить клиента">
        <UButton label="Добавить" color="neutral" variant="subtle" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Имя клиента" name="name">
                    <UInput v-model="state.name" />
                </UFormField>

                <UFormField label="Номер телефона" name="phone">
                    <UInput v-model="state.phone" type="phone" />
                </UFormField>
                <UFormField label="Примечание" name="note">
                    <UInput v-model="state.note" />
                </UFormField>

                <UButton type="submit">
                    Добавить
                </UButton>
            </UForm>
        </template>
    </USlideover>
</template>
<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

const clientStore = useClientsStore()

const toast = useToast()

const state = reactive({
    name: '',
    phone: '',
    note: '',
})

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    await clientStore.addClient(event.data)
    toast.add({ title: 'Клент успешно добавлен', color: 'success' })
    await clientStore.fetchClients()
}

</script>