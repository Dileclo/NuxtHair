// server/utils/db.ts
import { MongoClient, Db } from 'mongodb'

let _client: MongoClient | null = null
let _db: Db | null = null

export async function getDb(): Promise<Db> {
    if (_db) return _db

    const config = useRuntimeConfig()
    const uri = config.mongoUri || process.env.MONGO_URI
    const dbName = config.mongoDb || process.env.MONGO_DB

    if (!uri || !dbName) {
        throw createError({ statusCode: 500, statusMessage: 'Mongo config missing' })
    }

    // В dev перезапуски HMR: кешируем в globalThis
    const g = globalThis as any
    if (!g.__mongo) g.__mongo = { client: null as MongoClient | null, db: null as Db | null }

    if (g.__mongo.db) return g.__mongo.db

    const client = new MongoClient(uri)
    await client.connect()

    _client = client
    _db = client.db(dbName)

    g.__mongo.client = _client
    g.__mongo.db = _db

    return _db
}
