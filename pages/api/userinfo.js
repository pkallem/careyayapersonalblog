import { db, userinfo } from './drizzle';
import {eq} from "drizzle-orm";

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {

      const rows = await db.select().from(userinfo).where(eq(userinfo.user_id, request.query.user_id));
      return response.status(200).json({ userinfo : rows[0] });

    } else if (request.method === 'PUT') {

      const { user_id, bio, resume_link } = request.body;
      if (!user_id || !bio || !resume_link) {
        return response.status(400).json({ error: 'user_id, bio and resume_link fields are required.' });
      }
      await db.update(userinfo).set({bio: bio, resume_link: resume_link}).where(eq(userinfo.user_id, user_id));
      return response.status(200).json({ message: 'User info updated.' });

    } else if (request.method === 'POST') {
      
      const { user_id, bio, resume_link } = request.body;
      if (!user_id || !bio || !resume_link) {
        return response.status(400).json({ error: 'user_id, bio and resume_link fields are required.' });
      }
      
      const newUser = await db.insert(userinfo).values({ user_id, bio, resume_link }).execute();
      if (!newUser) {
        return response.status(500).json({ error: 'Could not create user.' });
      }

      return response.status(200).json({ message: 'User info created.' });
    
    } else {
      response.status(405).json({ error: 'Invalid request method' });
    }
  } catch (error) {
    console.error('Exception caught:', error);
    return response.status(500).json({ error: error.message });
  }
}
