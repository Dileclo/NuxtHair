import { getDb } from '../../utils/db'


export default defineEventHandler(async (event) => {
    const db = await getDb()

    if (event.method === 'GET') {
        const rows = await db.collection('services').find().toArray()
        return rows
    }

    if (event.method === 'POST') {
        const body = await readBody(event)
        console.log(body)
        const service = await db.collection('services').insertOne(body)
        return service
    }
})
