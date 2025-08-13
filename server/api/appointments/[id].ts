import { ObjectId } from 'mongodb'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (method === 'GET') {
    const id = event.context.params.id
    const res = await db.collection('appointments').findOne({ _id: new ObjectId(id) })
    return res
  }

  if (event.method === 'PATCH') {
    const body = await readBody(event)
    const patch: any = {}

    // даты приходят ISO — храним в Mongo как Date
    if (body.start) patch.start = new Date(body.start)
    if (body.end) patch.end = new Date(body.end)

      ;['clientId', 'note', 'color', 'service', 'price', 'title'].forEach(k => {
        if (body[k] !== undefined) patch[k] = body[k]
      })

    const res = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...patch, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!res.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    const v = res.value
    return { ...v, _id: v._id.toString() }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })

})
