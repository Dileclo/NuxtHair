import { defineStore } from "pinia";

export const useClientsStore = defineStore("clients", () => {
  const clients = ref<any[]>([]);
  const api = useApi();
  const client = ref();

  const addClient = async (client) => {
    api.post("/clients", client);
    await fetchClients();
  };

  const fetchClients = async () => {
    const res = await api.get("/clients");
    clients.value = res;
  };

  const removeClient = async (id) => {
    api.delete(`/clients/${id}`);
    await fetchClients();
  };

  const findClient = async (id: string) => {
    // 1. Ищем в уже загруженных клиентах
    let found = clients.value.find((c) => String(c._id) === String(id));
    if (found) return found;

    // 2. Если нет — загружаем с сервера
    try {
      const data = await api.get(`/clients/${id}`);
      if (data) {
        clients.value.push(data); // 3. Кэшируем
        return data;
      }
    } catch (err) {
      console.error(`Не удалось найти клиента с id=${id}`, err);
      return null;
    }
  };

  const updateClient = async (id, patch) => {
    const res = await api.patch(`/clients/${id}`, patch);
    await fetchClients();
    return res;
  };

  return { clients, addClient, fetchClients, removeClient, findClient, updateClient };
});
