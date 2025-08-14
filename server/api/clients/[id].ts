import { getDb } from "../../utils/db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const db = await getDb();
  const id = getRouterParam(event, "id");

  if (event.method == "GET") {
    const client = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(id) });
    return client;
  }

  if (event.method == "DELETE") {
    const client = await db
      .collection("clients")
      .deleteOne({ _id: new ObjectId(id) });
    return { ok: true };
  }
  if (event.method == "PATCH") {
    const body = await readBody(event);
    const patch: any = {
      name: body.name,
      phone: body.phone,
      note: body.note,
    };
    const res = await db
      .collection("clients")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...patch, updatedAt: new Date() } },
        { returnDocument: "after" }
      );
    return { ok: true };
  }
});
