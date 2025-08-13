// stores/appointments.ts
import { defineStore } from "pinia";

export const useAppointmentsStore = defineStore("appointments", () => {
  const events = ref<any[]>([]);
  const api = useApi();

  const normalize = (r: any) => {
    const id = String(r._id ?? r.id); // гарантируем строку
    const title = String(r.title ?? r.service ?? r.note ?? "Запись");
    return {
      ...r,
      id, // VueCal будет видеть id
      _id: id, // для PATCH
      start: new Date(r.start),
      end: new Date(r.end),
      title,
      content: r.content ?? title,
    };
  };

  async function fetchEvents() {
    const rows = await api.get("/appointments");
    events.value = rows.filter((r: any) => r.start && r.end).map(normalize);
  }

  async function addEvent(payload: any) {
    const created = await api.post("/appointments", payload);
    events.value = [...events.value, normalize(created)]; // иммутабельно!
  }

  async function updateEvent(id: string, patch: any) {
    console.log(id);
    const updated = await api.patch(`/appointments/${id}`, patch);
    const ev = normalize(updated);
    // тоже иммутабельно:
    events.value = events.value.map((e) => (e._id === id ? ev : e));
    return ev;
  }

  async function removeEvent(id: string) {
    await api.delete(`/appointments/${id}`);
    events.value = events.value.filter((e) => e._id !== id);
  }

  return { events, fetchEvents, addEvent, updateEvent, removeEvent };
});
