// composables/useApi.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

let api: AxiosInstance | null = null

export function useApi(): AxiosInstance {
    if (api) return api

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase || '/api'

    api = axios.create({
        baseURL,
        timeout: 10000, // 10 секунд
    })

    // Можно добавить токен/хедеры
    api.interceptors.request.use((req) => {
        // например, авторизация
        // const token = useAuthStore().token
        // if (token) req.headers.Authorization = `Bearer ${token}`
        return req
    })

    // Обработка ошибок
    api.interceptors.response.use(
        (res) => res.data,
        (err) => {
            console.error('API error:', err.response?.data || err.message)
            return Promise.reject(err)
        }
    )

    return api
}
