import { ObjectId } from 'mongodb'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    const db = await getDb()
    const method = event.method

    if (method === 'POST') {
        const body = await readBody(event)
        const client = await db.collection('clients').insertOne(body)
        return client
    }
    if (method === 'GET') {
        const clients = await db.collection('clients').find().toArray()
        return clients
    }
    if (method === 'DELETE') {
        const id = getRouterParam(event, 'id')
        if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })
        const client = await db.collection('clients').deleteOne({ _id: new ObjectId(id) })
        return client
    }
})