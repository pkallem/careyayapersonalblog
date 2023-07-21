import { db } from '@vercel/postgres';

const setupDatabase = async () => {
  const client = await db.connect();
  try {
    await client.query(
      'CREATE TABLE IF NOT EXISTS userblogs (id SERIAL PRIMARY KEY, Title varchar(255), Content text, user_id Integer);'
    );
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
};

setupDatabase();

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { title, content, user_id } = request.body;
    if (!title || !content || !user_id) {
      return response.status(400).json({ error: 'Title, Content, user_id fields are required.' });
    }

    const client = await db.connect();

    try {
      await client.query('INSERT INTO userblogs (Title, Content, user_id) VALUES ($1, $2, $3);', [title, content, user_id]);
    } catch (error) {
      return response.status(500).json({ error });
    } finally {
      client.release();
    }
  } 

  const blogs = await db.query('SELECT * FROM userblogs;');
  return response.status(200).json({ blogs: blogs.rows });
}
