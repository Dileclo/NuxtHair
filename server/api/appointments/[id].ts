// server/api/appointments/[id].ts
import { getDb } from '../../utils/db'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })
  const _id = new ObjectId(id)

  if (event.method === 'PATCH') {
    const body = await readBody(event)
    const patch: any = {}
    if (body.start) patch.start = new Date(body.start)
    if (body.end)   patch.end   = new Date(body.end)
    ;['clientId','note','color','service','price','title'].forEach(k => {
      if (body[k] !== undefined) patch[k] = body[k]
    })
    const res = await db.collection('appointments').findOneAndUpdate(
      { _id }, { $set: { ...patch, updatedAt: new Date() } }, { returnDocument: 'after' }
    )
  }

  if (event.method === 'DELETE') {
    const { deletedCount } = await db.collection('appointments').deleteOne({ _id })
    if (!deletedCount) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return { ok: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
