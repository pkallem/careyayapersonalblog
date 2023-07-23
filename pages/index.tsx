// pages/index.tsx

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout from '../components/layout';
import { useSession } from 'next-auth/react';

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author: string;
}

interface HomeProps { }

export default function Home(props: HomeProps) {
  const { data: session, status } = useSession();
  const [apiResult, setApiResult] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.blogList}>
            {apiResult.map((blog) => (
              <div key={blog.id} className={styles.blogBox}>
                <Link href={`/${blog.id}`}>
                  <h2 className={styles.blogTitle}>{blog.title}</h2>
                </Link>
                <p className={styles.blogContent}>{blog.author}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
