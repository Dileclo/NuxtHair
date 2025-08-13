// server/api/appointments/index.ts
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = await getDb()

  if (event.method === 'GET') {
    const rows = await db.collection('appointments').find().toArray()
    return rows.map(r => ({ ...r, _id: r._id.toString() }))
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const doc = {
      clientId: body.clientId,
      start: new Date(body.start),
      end: new Date(body.end),
      service: body.service ?? null,
      price: body.price ?? null,
      note: body.note ?? '',
      color: body.color ?? null,
      title: body.title ?? body.service ?? 'Запись',
      createdAt: new Date()
    }
    const { insertedId } = await db.collection('appointments').insertOne(doc)
    return { _id: insertedId.toString(), ...doc }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
