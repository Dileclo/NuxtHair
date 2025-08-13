// composables/useApi.ts
import axios from 'axios'

export function useApi() {
    const config = useRuntimeConfig()
    const api = axios.create({ baseURL: config.public.apiBase || '/api' })

    // Вернём сразу data, чтобы в сторе можно было делать: const list = await api.get('/clients')
    api.interceptors.response.use((res) => res.data)

    return api
}
