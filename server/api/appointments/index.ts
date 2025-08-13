import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const method = event.method

  if (method === 'POST') {
    const body = await readBody(event)

    // если хранишь даты как Date в Mongo:
    const doc = {
      ...body,
      // убедись что это Date, а не строка
      start: new Date(body.start),
      end: new Date(body.end),
      createdAt: new Date()
    }

    const { insertedId } = await db.collection('appointments').insertOne(doc)
    return { _id: insertedId.toString(), ...doc }
  }

  if (method === 'GET') {
    const rows = await db.collection('appointments').find().toArray()

    // приведи _id к строке и, при необходимости, даты к Date
    return rows.map(r => ({
      ...r,
      _id: r._id.toString(),
      start: new Date(r.start),
      end: new Date(r.end)
    }))
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
