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
  const client = await db.connect();
  try {
    if (request.method === 'GET') {
      if (request.query.id) {
        const { rows } = await client.query('SELECT * FROM userblogs WHERE id = $1;', [request.query.id]);
        return response.status(200).json({ blog: rows[0] });
      } else {
        const { rows } = await client.query('SELECT * FROM userblogs;');
        return response.status(200).json({ blogs: rows });
      }
    } else if (request.method === 'POST') {
      const { title, content, user_id } = request.body;
      if (!title || !content || !user_id) {
        return response.status(400).json({ error: 'title, content and user_id fields are required.' });
      }

      await client.query('INSERT INTO userblogs (Title, Content, user_id) VALUES ($1, $2, $3);', [
        title,
        content,
        user_id,
      ]);
      return response.status(200).json({ message: 'Blog created.' });
    } else if (request.method === 'DELETE') {
      const { id, user_id } = request.body;
      if (!id || !user_id) {
        return response.status(400).json({ error: 'id and user_id fields are required.' });
      }

      const { rows } = await client.query('SELECT user_id FROM userblogs WHERE id = $1;', [id]);
      if (rows[0].user_id != user_id) {
        return response.status(403).json({ error: 'Unauthorized.' });
      }

      await client.query('DELETE FROM userblogs WHERE id = $1;', [id]);
      return response.status(200).json({ message: 'Blog deleted.' });
    } else if (request.method === 'PUT') {
      const { id, newTitle, newContent, user_id } = request.body;
      if (!id || !newTitle || !newContent || !user_id) {
        return response.status(400).json({ error: 'id, newTitle, newContent, and user_id fields are required.' });
      }

      const { rows } = await client.query('SELECT user_id FROM userblogs WHERE id = $1;', [id]);
      if (rows[0].user_id != user_id) {
        return response.status(403).json({ error: 'Unauthorized.' });
      }

      await client.query('UPDATE userblogs SET Title = $1, Content = $2 WHERE id = $3;', [newTitle, newContent, id]);
      return response.status(200).json({ message: 'Blog updated.' });
    } else {
      response.status(405).json({ error: 'Invalid request method' });
    }
  } catch (error) {
    return response.status(500).json({ error });
  } finally {
    client.release();
  }
}
