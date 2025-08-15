<template>
  <div class="font-bold text-2xl mb-2">Карточка клиента</div>

  <UForm class="space-y-4" @submit="onSubmit" :state="state">
    <UFormField class="font-bold" label="Имя клиента">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <UFormField class="font-bold" label="Номер телефона">
      <UInput v-model="state.phone" type="tel" class="w-full" />
    </UFormField>

    <UFormField class="font-bold mt-2" label="Примечание">
      <UInput v-model="state.note" class="w-full" />
    </UFormField>

    <UButton type="submit">Изменить</UButton>
  </UForm>
  <div class="font-bold text-2xl my-2">Статистика</div>
  <div class="space-y-2">
    <div>Всего посещений: <UBadge color="success">{{ visitRows.length }}</UBadge>
    </div>
    <div>Общая сумма: <UBadge color="success">{{ total }} ₽</UBadge>
    </div>
    <div>Последнее посещение <UBadge color="success">{{ lastVisit }}</UBadge>
    </div>
  </div>
  <div class="font-bold text-2xl my-2">История посещений</div>
  <!-- ВАЖНО: передаём данные в таблицу -->
  <UTable v-model:sorting="sorting" :columns="columns" :data="visitRows" />
</template>

<script setup lang="ts">
const clientStore = useClientsStore();
const appointmentStore = useAppointmentsStore();
const route = useRoute();
const toast = useToast();
const sorting = ref([{ id: "date", desc: true }]);
const lastVisit = computed(() => {
  return visitRows.value.length ? visitRows.value[0].date : ""
})
const total = computed(() => {
  const list = Array.isArray(appointmentStore.events)
    ? appointmentStore.events
    : [];
  return list
    .filter((e: any) => String(e.clientId.value) === String(route.params.id))
    .reduce((acc: number, e: any) => acc + Number(e.price), 0);
})
const state = reactive({
  name: "",
  phone: "",
  note: "",
});

// колонки как были
const columns = [
  { accessorKey: "date", header: "Дата", sortable: true },
  { accessorKey: "service", header: "Услуга" },
  { accessorKey: "price", header: "Цена" },
];

// формат даты (дд.мм.гггг чч:мм)
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

// строки для таблицы: фильтруем события по clientId
const visitRows = computed(() => {
  const id = String(route.params.id);
  const list = Array.isArray(appointmentStore.events)
    ? appointmentStore.events
    : [];
  return list
    .filter((e: any) => String(e.clientId.value) === id)
    .sort((a: any, b: any) => +new Date(b.start) - +new Date(a.start))
    .map((e: any) => ({
      date: fmt(e.start),
      service: e.service.label ?? "",
      price: e.price ?? "",
    }));
});

const onSubmit = async () => {
  await clientStore.updateClient(String(route.params.id), {
    name: state.name,
    phone: state.phone,
    note: state.note,
  });
  toast.add({ title: "Клиент успешно изменён", color: "success" });
};

onMounted(async () => {
  // подтянуть клиента
  const client = await clientStore.findClient(String(route.params.id));
  if (client) {
    state.name = client.name ?? "";
    state.phone = client.phone ?? "";
    state.note = client.note ?? "";
  }
  // подтянуть записи, чтобы история отобразилась
  await appointmentStore.fetchEvents();
});
</script>
