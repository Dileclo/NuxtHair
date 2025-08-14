// stores/services.ts
import { defineStore } from 'pinia'

type Service = { _id: string; title: string; createdAt?: string }

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const api = useApi()

  async function fetchServices() {
    services.value = await api.get<Service[]>('/services')
  }

  async function addService(title: string) {
    const created = await api.post<Service>('/services', { title })
    services.value = [...services.value, created] // новая ссылка → реактивно
  }

  async function removeService(id: string) {
    await api.delete(`/services/${id}`)
    services.value = services.value.filter(s => s._id !== id)
  }

  // Для выпадающих списков
  const serviceItems = computed(() =>
    services.value.map(s => ({ label: s.title, value: s._id }))
  )

  return { services, serviceItems, fetchServices, addService, removeService }
})
