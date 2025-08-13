import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    const db = await getDb()
    const method = event.method

    if (method === 'POST'){
        const body = await readBody(event)
        const client = await db.collection('clients').insertOne(body)
        return client
    }
    if (method === 'GET'){
        const body = await readBody(event)
        return "HELLO"
    }
})