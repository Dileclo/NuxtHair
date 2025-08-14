<template>
  <div class="flex items-center justify-between">
    <div class="text-2xl font-bold">Клиенты</div>
    <ModalAddClient />
  </div>

  <UInput v-model="globalFilter" class="mt-3" placeholder="Поиск..." />

  <!-- отдаём уже ПАГИНИРОВАННЫЕ данные -->
  <UTable :columns="columns" :data="pagedClients" class="mt-3" />

  <!-- пагинация -->
  <div class="mt-3 flex items-center justify-between">
    <div class="text-sm opacity-70">
      Показано {{ rangeFrom }}–{{ rangeTo }} из {{ total }}
    </div>
    <div class="flex items-center gap-2">
      <UButton variant="soft" :disabled="page === 1" @click="page--"
        >Назад</UButton
      >
      <span class="text-sm">Стр. {{ page }} / {{ pageCount }}</span>
      <UButton variant="soft" :disabled="page === pageCount" @click="page++"
        >Вперёд</UButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { h, ref, computed, watch, onMounted } from "vue";
import { UButton } from "#components";

const clientStore = useClientsStore();
const globalFilter = ref("");
const route = useRouter()
const page = ref(1);
const pageSize = 10;

// всегда массив
const rawClients = computed<any[]>(() =>
  Array.isArray(clientStore.clients) ? clientStore.clients : []
);

// фильтрация по поиску
const filteredClients = computed(() => {
  const list = rawClients.value;
  const q = globalFilter.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c: any) => {
    const name = String(c?.name ?? "").toLowerCase();
    const phone = String(c?.phone ?? "");
    return name.includes(q) || phone.includes(q);
  });
});

const total = computed(() => filteredClients.value.length);
const pageCount = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize))
);

// если урезалось — вернуть на 1-ю страницу
watch([filteredClients, pageCount], () => {
  if (page.value > pageCount.value) page.value = 1;
});

// текущий срез
const pagedClients = computed(() => {
  const list = filteredClients.value;
  const start = (page.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});

const rangeFrom = computed(() =>
  total.value ? (page.value - 1) * pageSize + 1 : 0
);
const rangeTo = computed(() => Math.min(page.value * pageSize, total.value));

const columns = ref([
  { accessorKey: "name", header: "Имя" },
  { accessorKey: "phone", header: "Телефон" },
  {
    header: "Действия",
    cell: ({ row }: any) => {
      const id = row.original?._id;
      return h("div", { class: "flex items-center justify-end gap-2" }, [
        h(UButton, {
          icon: "i-lucide-pencil",
          color: "neutral",
          variant: "soft",
          onClick: () => route.push(`/client/${id}`),
        }),
        h(UButton, {
          icon: "i-lucide-trash-2",
          color: "error",
          variant: "soft",
          onClick: async () => {
            if (await confirm("Вы уверены?")) {
              await clientStore.removeClient(id);
              if (pagedClients.value.length === 0 && page.value > 1)
                page.value--;
            }
          },
        }),
      ]);
    },
  },
]);

onMounted(async () => {
  await clientStore.fetchClients();
});
</script>
