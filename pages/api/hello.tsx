import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

const setupDatabase = async () => {
  const client = await db.connect();
  try {
    await client.query(
      'CREATE TABLE IF NOT EXISTS Blogs (id SERIAL PRIMARY KEY, Title varchar(255), Content text);'
    );
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
};

setupDatabase();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const { title, content } = request.body;

    if (!title || !content) {
      return response.status(400).json({ error: 'Title and Content fields are required.' });
    }

    const client = await db.connect();

    try {
      await client.query('INSERT INTO Blogs (Title, Content) VALUES ($1, $2);', [title, content]);
    } catch (error) {
      return response.status(500).json({ error });
    } finally {
      client.release();
    }
  } else if (request.method === 'DELETE') {
    const { id } = request.query;

    if (!id) {
      return response.status(400).json({ error: 'Blog ID is required.' });
    }

    const client = await db.connect();

    try {
      await client.query('DELETE FROM Blogs WHERE id = $1;', [id]);
    } catch (error) {
      return response.status(500).json({ error });
    } finally {
      client.release();
    }
  }

  const blogs = await db.query('SELECT * FROM Blogs;');
  return response.status(200).json({ blogs: blogs.rows });
}
