<template>
    <div class="flex items-center justify-between">
        <div class="text-2xl font-bold">Клиенты</div>
        <ModalAddClient></ModalAddClient>
    </div>
    <UTable :columns="columns" :data="clients" class="mt-3" />
</template>
<script setup lang="ts">
const clientStore = useClientsStore()
const clients = ref([])
const columns = ref([
    {
        accessorKey: 'name',
        header: 'Имя',
    },
    {
        accessorKey: 'phone',
        header: 'Телефон',
    },

])

onMounted(async () => {
    await clientStore.fetchClients()
    clients.value = clientStore.clients
})
</script>