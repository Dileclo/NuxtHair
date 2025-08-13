import { defineStore } from 'pinia'

export const useClientsStore = defineStore('clients', () => {
    const clients = ref([])
    const api = useApi()

    const addClient = async (client) => {
        api.post('/clients', client)
    }

    const fetchClients = async () => {
        const res = await api.get('/api/staff')
    }

    return { clients,addClient }
})