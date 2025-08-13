// stores/appointments.ts
import { defineStore } from 'pinia'

export const useAppointmentsStore = defineStore('appointments', () => {
  const events = ref<any[]>([])
  const api = useApi()

  const normalize = (r: any) => {
    const id = String(r._id ?? r.id)              // гарантируем строковый id
    const title = String(r.title ?? r.service ?? r.note ?? 'Запись')
    return {
      ...r,
      id,                                         // VueCal будет опираться на id
      _id: id,                                    // для PATCH/DELETE
      start: new Date(r.start),                   // VueCal требует Date
      end: new Date(r.end),
      title,
      content: r.content ?? title
    }
  }

  async function fetchEvents() {
    const rows = await api.get('/appointments')
    events.value = rows.filter((r:any)=>r.start && r.end).map(normalize)
  }

  async function addEvent(payload: {
    clientId: string; start: string; end: string;
    note?: string; color?: string; service?: string;
    price?: number | string; title?: string;
  }) {
    const created = await api.post('/appointments', payload)
    events.value = [...events.value, normalize(created)] // новая ссылка → VueCal перерисует
  }

  async function updateEvent(id: string, patch: any) {
    if (!id) throw new Error('updateEvent: id is required')
    const updated = await api.patch(`/appointments/${id}`, patch)
    const ev = normalize(updated)
    events.value = events.value.map(e => (String(e._id ?? e.id) === id ? ev : e))
    return ev
  }

  async function removeEvent(id: string) {
    if (!id) throw new Error('removeEvent: id is required')
    await api.delete(`/appointments/${id}`)
    events.value = events.value.filter(e => String(e._id ?? e.id) !== id)
  }

  return { events, fetchEvents, addEvent, updateEvent, removeEvent }
})
