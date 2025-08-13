import { getDb } from '../../utils/db'
import { getMethod, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
    const db = await getDb()
    const method = getMethod(event)

 })