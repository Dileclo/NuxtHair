import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', () => {
  const service = ref('')
  const api = useApi()

  const addService = async (service) => {
    await api.post('/services', service)
    await fetchServices()
  }

  const fetchServices = async () => {
    const res = await api.get('/services')
    service.value = res
  }
  return { service, addService,fetchServices }
})
