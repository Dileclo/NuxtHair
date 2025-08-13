// stores/appointments.ts
import { defineStore } from 'pinia'

export const useAppointmentsStore = defineStore('appointments', () => {
  const events = ref<any[]>([])
  const api = useApi()

  async function fetchEvents() {
    const rows = await api.get('/appointments')
    events.value = rows
      .filter((r: any) => r.start && r.end)
      .map((r: any) => {
        const title = String(r.title ?? r.clientName ?? r.service ?? r.note ?? 'Запись')
        return {
          ...r,
          start: new Date(r.start),
          end: new Date(r.end),
          title,
          content: r.content ?? title,   // на всякий случай
        }
      })
  }

  async function fetchEventById(id: string) {
    const res = await api.get(`/appointments/${id}`)
    return res
  }

  async function addEvent(payload: {
    clientId: string
    start: string // ISO
    end: string   // ISO
    note?: string
    color?: string
    service?: string
    price?: number | string
    title?: string
  }) {
    const created = await api.post('/appointments', payload)
    const title = String(created.title ?? created.clientName ?? created.service ?? created.note ?? 'Запись')
    events.value.push({
      ...created,
      start: new Date(created.start),
      end: new Date(created.end),
      title,
      content: created.content ?? title,
    })
  }

  async function updateEvent(id: string, patch: {
    clientId?: string; start?: string; end?: string; note?: string; color?: string; service?: string; price?: number | string; title?: string;
  }) {
    const updated = await api.patch(`/appointments/${id}`, patch)
    const idx = events.value.findIndex(e => e._id === id)
    if (idx !== -1) {
      const title = String(updated.title ?? updated.clientName ?? updated.service ?? updated.note ?? 'Запись')
      events.value[idx] = {
        ...events.value[idx],
        ...updated,
        start: new Date(updated.start),
        end: new Date(updated.end),
        title,
        content: updated.content ?? title
      }
    }
    return updated
  }

  return { events, fetchEvents, addEvent, fetchEventById, updateEvent }
})
