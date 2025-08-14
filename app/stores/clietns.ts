import { defineStore } from 'pinia'

export const useClientsStore = defineStore('clients', () => {
    const clients = ref()
    const api = useApi()

    const addClient = async (client) => {
        api.post('/clients', client)
        await fetchClients()
    }

    const fetchClients = async () => {
        const res = await api.get('/clients')
        clients.value = res
    }

    const removeClient = async (id) => {
        api.delete(`/clients/${id}`)
        await fetchClients()
    }

    return { clients,addClient,fetchClients,removeClient }
})