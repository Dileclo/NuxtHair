// server/api/appointments/[id].ts
import { getDb } from "../../utils/db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const db = await getDb();
  const id = getRouterParam(event, "id");
  console.log(id);
  if (!id) throw createError({ statusCode: 400, statusMessage: "id required" });

  if (event.method === "PATCH") {
    const body = await readBody(event);
    const patch: any = {};
    if (body.start) patch.start = new Date(body.start);
    if (body.end) patch.end = new Date(body.end);
    ["clientId", "note", "color", "service", "price", "title"].forEach((k) => {
      if (body[k] !== undefined) patch[k] = body[k];
    });
    const res = await db
      .collection("appointments")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...patch, updatedAt: new Date() } },
        { returnDocument: "after" }
      );
    if (!res.value)
      throw createError({ statusCode: 404, statusMessage: "Not found" });
    const v = res.value;
    return { ...v, _id: v._id.toString() };
  }

  if (event.method === "DELETE") {
    const res = await db
      .collection("appointments")
      .findOneAndDelete({ _id: new ObjectId(id) });
    if (!res.value)
      throw createError({ statusCode: 404, statusMessage: "Not found" });
    const v = res.value;
    return { ...v, _id: v._id.toString() };
  }

  throw createError({ statusCode: 405, statusMessage: "Hi" });
});
