import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import CreateBlogPopup from '../components/CreateBlogPopup';
import EditBlogPopup from '../components/EditBlogPopup';
import Link from 'next/link';
import Layout from '../components/layout';
import { useSession } from 'next-auth/react';

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

interface HomeProps { }

export default function Home(props: HomeProps) {
  const { data: session, status } = useSession();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<Blog[]>([]);
  const [blogBeingEdited, setBlogBeingEdited] = useState<Blog | null>(null);
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
        body: JSON.stringify({ title, content, user_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Added delete and edit methods
  const handleDeleteBlog = async (id: number) => {
    try {
      const response = await fetch('/api/hello', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, user_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditBlog = async (id: number, newTitle: string, newContent: string) => {
    try {
      const response = await fetch('/api/hello', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newTitle, newContent, user_id }),
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
          {showEditPopup && blogBeingEdited && <EditBlogPopup blog={blogBeingEdited} onClose={() => setShowEditPopup(false)} onEditBlog={handleEditBlog} />}
          <button onClick={() => setShowPopup(true)}>+</button>
          <div className={styles.blogList}>
            {apiResult.map((blog) => (
              <div>
                {blog.user_id == user_id && (
                  <div key={blog.id} className={styles.blogBox}>
                    <h2 className={styles.blogTitle}>{blog.title}</h2>
                    <p className={styles.blogContent}>{blog.content}</p>
                    <p className={styles.blogContent}>{blog.user_id}</p>
                    {blog.user_id == user_id && (
                      <div>
                        <button onClick={() => {
                          setBlogBeingEdited(blog);
                          setShowEditPopup(true);
                        }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
                      </div>
                    )}
                  </div>)}
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
