import { defineStore } from 'pinia'

export const useClients = defineStore('clients', () => {
    const clients = ref([])
    const api = useApi()

    const addClient = async (client) => {
        
    }

    const fetchClients = async () => {
        const res = await api.get('/api/staff')
    }

    return { clients,addClient }
})