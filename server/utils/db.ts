import { MongoClient, Db } from 'mongodb'

let cachedDb: Db | null = null

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb

  const cfg = useRuntimeConfig()
  const uri =
    cfg.mongoUri ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI // поддержим оба варианта
  const dbName =
    cfg.mongoDb ||
    process.env.MONGO_DB ||
    process.env.MONGODB_DB ||
    process.env.MONGO_DATABASE

  if (!uri || !dbName) {
    throw createError({
      statusCode: 500,
      statusMessage: `Mongo config missing: uri=${!!uri}, db=${!!dbName}`
    })
  }

  const g = globalThis as any
  if (g.__db) return (cachedDb = g.__db)

  const client = new MongoClient(uri)
  await client.connect()
  cachedDb = client.db(dbName)
  g.__db = cachedDb
  return cachedDb
}
