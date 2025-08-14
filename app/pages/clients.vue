<template>
    <div class="flex items-center justify-between">
        <div class="text-2xl font-bold">Клиенты</div>
        <ModalAddClient></ModalAddClient>
    </div>
    <UTable :columns="columns" :data="clients" class="mt-3" />
</template>
<script setup lang="ts">
import { UButton } from '#components';

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
    {
        accessorKey: 'actions',
        header: '',
        enableSorting: false,
        enableResizing: false,
        cell: ({ row }) => {
            return h(
                UButton,
                {
                    label: 'Удалить',
                    color: 'red',
                    variant: 'subtle',
                    onClick: async () => {
                        await clientStore.removeClient(row.original._id)
                        console.log(row.original._id)
                    }
                }
            )
        },
    }

])

onMounted(async () => {
    await clientStore.fetchClients()
    clients.value = clientStore.clients
})
</script>