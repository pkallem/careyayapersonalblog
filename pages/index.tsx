import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout from '../components/layout';

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/hello').then(res => res.json()).then(({ blogs }) => setBlogs(blogs));
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.blogList}>
            {blogs.map(({ id, title, content, user_id }) => (
              <div key={id} className={styles.blogBox}>
                <Link href={`/${id}`}>
                  <h2 className={styles.blogTitle}>{title}</h2>
                </Link>
                <p className={styles.blogContent}>{content}</p>
                <p className={styles.blogContent}>{user_id}</p>
                
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}