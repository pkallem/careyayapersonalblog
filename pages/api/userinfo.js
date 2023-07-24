import { db, userinfo } from './drizzle';
import {eq} from "drizzle-orm";

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {

      const rows = await db.select().from(userinfo).where(eq(userinfo.user_id, request.query.user_id));
      console.log(rows);
      return response.status(200).json({ rows });

    } else {
      response.status(405).json({ error: 'Invalid request method' });
    }
  } catch (error) {
    return response.status(500).json({ error });
  }
}
