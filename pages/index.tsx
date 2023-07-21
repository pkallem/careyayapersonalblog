import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import CreateBlogPopup from '../components/CreateBlogPopup';
import Link from 'next/link';
import Layout from '../components/layout';
import { useSession } from 'next-auth/react'; // Import useSession hook



interface Blog {
  id: number;
  title: string;
  content: string;
}

interface HomeProps {}

export default function Home(props: HomeProps) {
  const [apiResult, setApiResult] = useState<Blog[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { data: session, status } = useSession(); // Use useSession hook to access the session
  const user_id = session?.user?.id;

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleAddBlog = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, user_id }), // Add user_id to the request payload
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


        {showPopup && <CreateBlogPopup onClose={() => setShowPopup(false)} onAddBlog={handleAddBlog} />}
        <button onClick={() => setShowPopup(true)}>
          +
        </button>
        <div className={styles.blogList}>

          {apiResult.map((blog) => (
            <div key={blog.id} className={styles.blogBox}>
              <Link href={`/api/blogs/${blog.id}`}>
                  <h2 className={styles.blogTitle}>{blog.title}</h2>
                  <p className={styles.blogContent}>{blog.content}</p>
                  <p className={styles.blogContent}>{blog.user_id}</p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
    </Layout>
  );
}
