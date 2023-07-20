import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import CreateBlogPopup from '../components/CreateBlogPopup';
import Link from 'next/link';
import Layout from '../components/layout';

interface Blog {
  id: number;
  title: string;
  content: string;
}

interface HomeProps {}

export default function Home(props: HomeProps) {
  const [apiResult, setApiResult] = useState<Blog[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`/api/hello/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddBlog = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Layout>
    <div className={styles.container}>
      <main className={styles.main}>
        <button className={styles.addButton} onClick={() => setShowPopup(true)}>
          +
        </button>

        {showPopup && <CreateBlogPopup onClose={() => setShowPopup(false)} onAddBlog={handleAddBlog} />}

        <div className={styles.blogList}>
          {apiResult.map((blog) => (
            <div key={blog.id} className={styles.blogBox}>
              <Link href={`/api/blogs/${blog.id}`}>
                  <h2 className={styles.blogTitle}>{blog.title}</h2>
                  <p className={styles.blogContent}>{blog.content}</p>
              </Link>
              <div className={styles.blogActions}>
                <button onClick={() => handleDeleteClick(blog.id)} className={styles.deleteButton}>
                  <span className={styles.dots}>...</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
    </Layout>
  );
}
