<template>
  <div>
    <VueCal class="h-full" sm locale="ru" v-model:events="appointmentStore.events" :today-button="false"
      :time-from="7 * 60" :time-to="21 * 60" :time-step="30" :views="['day', 'week', 'year']" :snap-to-interval="30"
      :editable-events="{
        create: true,
        resize: false,
        drag: false,
        delete: false,
      }" @event-click="editEvent" @event-create="createEvent">
      <template #event="{ event }">
        <div class="w-full">
          <div class="text-xs ">
            {{ event.clientId.label || "Запись" }}
          </div>
          {{ event.service.label }}
        </div>
      </template>
    </VueCal>
  </div>

  <USlideover v-model:open="open" title="Запись клиента">
    <template #body>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Клиент" name="clientId">
          <div class="flex items-center justify-between gap-2">
            <UInputMenu class="w-full" v-model="state.clientId" :items="clientItems" option-attribute="label"
              value-attribute="value" placeholder="Выберите клиента" />
            <UButton label="+" color="neutral" variant="subtle" @click="addClient" />
          </div>
        </UFormField>
        <UFormField label="Услуга" name="service">
          <UInputMenu class="w-full" v-model="state.service" :items="serviceStore.serviceItems" option-attribute="label"
            value-attribute="value" create-item placeholder="Выберите услугу" @create="onCreate" />
        </UFormField>

        <UFormField label="Цена" name="price">
          <UInput v-model="state.price" type="number" class="w-full" />
        </UFormField>
        <UFormField label="Время начала работы" name="start">
          <UInput v-model="state.start" type="datetime-local" class="w-full" />
        </UFormField>
        <UFormField label="Время окончания работы" name="end">
          <UInput v-model="state.end" type="datetime-local" class="w-full" />
        </UFormField>

        <UFormField label="Цвет" name="color">
          <UInputMenu v-model="state.color" :items="colorOptions" option-attribute="label" value-attribute="value"
            placeholder="Выберите цвет" />
        </UFormField>

        <UFormField label="Примечание" name="note">
          <UInput v-model="state.note" class="w-full" />
        </UFormField>

        <UButton type="submit">Добавить</UButton>
      </UForm>
    </template>
  </USlideover>
  <USlideover v-model:open="openEdit" title="Редактировать запись">
    <template #body>
      <UForm :state="state2" class="space-y-4" @submit="onEditSubmit">
        <UFormField label="Клиент" name="clientId">
          <UInputMenu class="w-full" v-model="state2.clientId" :items="clientItems" option-attribute="label"
            value-attribute="value" placeholder="Выберите клиента" />
        </UFormField>
        <UFormField label="Услуга" name="service">
          <UInputMenu class="w-full" v-model="state2.service" :items="serviceStore.serviceItems" option-attribute="label"
            value-attribute="value" placeholder="Выберите клиента" />
        </UFormField>

        <UFormField label="Цена" name="price">
          <UInput class="w-full" v-model="state2.price" type="number" />
        </UFormField>
        <UFormField label="Время начала работы" name="start">
          <UInput class="w-full" v-model="state2.start" type="datetime-local" />
        </UFormField>
        <UFormField label="Время окончания работы" name="end">
          <UInput class="w-full" v-model="state2.end" type="datetime-local" />
        </UFormField>
        <UFormField label="Цвет" name="color">
          <UInputMenu v-model="state2.color" :items="colorOptions" option-attribute="label" value-attribute="value"
            placeholder="Выберите цвет" />
        </UFormField>

        <UFormField label="Примечание" name="note">
          <UInput class="w-full" v-model="state2.note" />
        </UFormField>
        <div class="flex justify-between">
          <UButton type="submit">Изменить</UButton>
          <UButton @click="deleteEvent">Удалить</UButton>
        </div>
      </UForm>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { ModalAddClient } from "#components";
const overlay = useOverlay();
const modal = overlay.create(ModalAddClient);
import { VueCal } from "vue-cal";
import "vue-cal/style";

const clientStore = useClientsStore();
const appointmentStore = useAppointmentsStore();
const serviceStore = useServicesStore();
const editId = ref<string>("");

const open = ref(false);
const openEdit = ref(false);
const toast = useToast();
const state = reactive({
  clientId: "",
  start: "",
  end: "",
  service: "",
  color: "",
  note: "",
  price: "",
});
const state2 = reactive({
  clientId: "",
  start: "",
  end: "",
  service: "",
  color: "",
  note: "",
  price: "",
});

const clientItems = computed(() =>
  clientStore.clients.map((c: any) => ({
    label: c.name || "(без имени)",
    value: c._id,
  }))
);


const colorOptions = [
  { label: 'Синий', value: 'blue' },
  { label: 'Зелёный', value: 'green' },
  { label: 'Оранжевый', value: 'orange' },
  { label: 'Розовый', value: 'pink' },
]
const addClient = () => modal.open();

const selectedClient = computed(
  () => clientStore.clients.find((c: any) => c._id === state.clientId) || null
);

const onCreate = async (item) => {
  await serviceStore.addService(item);
  state.service = "";
};
function createEvent({ event, resolve }) {
  if (typeof resolve === "function") resolve(false);
  state.start = toLocalInput(event.start);
  state.end = toLocalInput(event.end);
  open.value = true;
}
function findEventId(ev: any) {
  const ts = (d: any) =>
    d instanceof Date ? d.getTime() : new Date(d).getTime();
  const match = appointmentStore.events.find(
    (e) => ts(e.start) === ts(ev.start) && ts(e.end) === ts(ev.end)
  );
  return match ? String(match._id ?? match.id ?? "") : "";
}

function editEvent({ event }: { event: any }) {
  // 1) пытаемся взять из самого события
  editId.value = String(event._id ?? event.id ?? "");

  // 2) если нет — ищем в сторе по времени
  if (!editId.value) editId.value = findEventId(event);

  if (!editId.value) {
    console.warn("Нет id у события", event);
    useToast().add({ title: "Не удалось определить ID записи", color: "red" });
    return;
  }

  state2.start = toLocalInput(new Date(event.start));
  state2.end = toLocalInput(new Date(event.end));
  state2.clientId = event.clientId || "";
  state2.service = event.service || "";
  state2.price = String(event.price ?? "");
  state2.note = event.note || "";
  state2.color = event.color || "";
  openEdit.value = true;
}

onMounted(async () => {
  await clientStore.fetchClients();
  await appointmentStore.fetchEvents();
  await serviceStore.fetchServices();
});

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  const startDate = fromLocalInput(state.start);
  const endDate = fromLocalInput(state.end);

  const startISO = startDate.toISOString();
  const endISO = endDate.toISOString();

  await appointmentStore.addEvent({
    clientId: state.clientId, // <-- без .value
    start: startISO,
    end: endISO,
    note: state.note,
    color: state.color,
    price: state.price,
    service: state.service,
    title: selectedClient.value?.name,
  });

  open.value = false;
  toast.add({ title: "Запись успешно добавлена", color: "success" });
}

const deleteEvent = async () => {
  if (!editId.value) {
    useToast().add({ title: "Не удалось определить ID записи", color: "red" });
    return;
  }
  await appointmentStore.removeEvent(editId.value);
  toast.add({ title: "Запись успешно удалена", color: "success" });
  openEdit.value = false;
};
async function onEditSubmit() {
  if (!editId.value) {
    useToast().add({ title: "Нет ID записи", color: "red" });
    return;
  }
  await appointmentStore.updateEvent(editId.value, {
    clientId: state2.clientId,
    service: state2.service,
    price: state2.price,
    note: state2.note,
    color: state2.color,
    start: fromLocalInput(state2.start).toISOString(),
    end: fromLocalInput(state2.end).toISOString(),
    title:
      clientStore.clients.find((c: any) => c._id === state2.clientId)?.name ||
      "Запись",
  });
  openEdit.value = false;
  useToast().add({ title: "Запись обновлена", color: "success" });
}

const pad = (n: number) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DDTHH:MM" (для v-model datetime-local)
function toLocalInput(d: Date) {
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

// "YYYY-MM-DDTHH:MM" -> Date (локальное время)
function fromLocalInput(s: string) {
  const [date, time] = s.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time ?? "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}
</script>
