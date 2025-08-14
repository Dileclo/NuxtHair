// server/api/services/index.ts
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    const db = await getDb()

    if (event.method === 'GET') {
        const rows = await db.collection('services').find().toArray()
        return rows.map(r => ({ ...r, _id: r._id.toString() }))
    }

    if (event.method === 'POST') {
        const body = await readBody(event) // может быть string или { title: string }

        const title =
            typeof body === 'string' ? body :
                typeof body?.title === 'string' ? body.title :
                    null

        if (!title || !title.trim()) {
            throw createError({ statusCode: 400, statusMessage: 'title is required' })
        }

        const doc = { title: title.trim(), createdAt: new Date() }
        const { insertedId } = await db.collection('services').insertOne(doc)
        return { _id: insertedId.toString(), ...doc }
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
