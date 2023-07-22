import { db, userblogs} from './drizzle';
import {eq} from "drizzle-orm";

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      if (request.query.id) {
        const rows = await db.select().from(userblogs).where(eq(userblogs.id, request.query.id));
        return response.status(200).json({ blog: rows[0] });
      } else {
        const rows = await db.select().from(userblogs);
        return response.status(200).json({ blogs: rows });
      }
    } else if (request.method === 'POST') {
      const { title, content, user_id } = request.body;
      if (!title || !content || !user_id) {
        return response.status(400).json({ error: 'title, content and user_id fields are required.' });
      }
      await db.insert(userblogs).values({ title: title, content : content, user_id: user_id});
      return response.status(200).json({ message: 'Blog created.' });
    } else if (request.method === 'DELETE') {
      const { id, user_id } = request.body;
      if (!id || !user_id) {
        return response.status(400).json({ error: 'id and user_id fields are required.' });
      }
      const rows = await db.select().from(userblogs).where(eq(userblogs.id, id));
      await db.delete(userblogs).where(eq(userblogs.id, id));
      return response.status(200).json({ message: 'Blog deleted.' });
    } else if (request.method === 'PUT') {
      const { id, newTitle, newContent, user_id } = request.body;
      if (!id || !newTitle || !newContent || !user_id) {
        return response.status(400).json({ error: 'id, newTitle, newContent, and user_id fields are required.' });
      }
      const rows = await db.select().from(userblogs).where(eq(userblogs.id, id));
      await db.update(userblogs).set({title: newTitle, content: newContent, user_id: user_id}).where(eq(userblogs.id, id));
      return response.status(200).json({ message: 'Blog updated.' });
    } else {
      response.status(405).json({ error: 'Invalid request method' });
    }
  } catch (error) {
    return response.status(500).json({ error });
  }
}
