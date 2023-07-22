import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import CreateBlogPopup from '../components/CreateBlogPopup';
import EditBlogPopup from '../components/EditBlogPopup';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';  // import the new component
import styles from '../styles/Home.module.css';
import { Console } from 'console';

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

export default function ProtectedPage() {
  const { data: session } = useSession();
  const [apiResult, setApiResult] = useState<Blog[]>([]);
  const [blogBeingEdited, setBlogBeingEdited] = useState<Blog | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);  
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);  
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

  const handleDeleteBlog = (id: number) => {  
    setBlogToDelete(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {  
    if (blogToDelete === null) return;

    try {
      const response = await fetch('/api/hello', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blogToDelete, user_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBlogToDelete(null);
      setShowDeletePopup(false);
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
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <h1>You must be logged in to view your blogs</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          {showCreatePopup && <CreateBlogPopup onClose={() => setShowCreatePopup(false)} onAddBlog={handleAddBlog} />}
          {showEditPopup && blogBeingEdited && <EditBlogPopup blog={blogBeingEdited} onClose={() => setShowEditPopup(false)} onEditBlog={handleEditBlog} />}
          {showDeletePopup && <DeleteConfirmationPopup onClose={() => setShowDeletePopup(false)} onConfirm={handleConfirmDelete} />}  
          <button onClick={() => setShowCreatePopup(true)}>+</button>
          {apiResult.map((blog) => (
            blog.user_id == user_id && (
              <div key={blog.id} className={styles.blogBox}>
                <h2 className={styles.blogTitle}>{blog.title}</h2>
                <p className={styles.blogContent}>{blog.content}</p>
                <button
                  onClick={() => {
                    setBlogBeingEdited(blog);
                    setShowEditPopup(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>  
              </div>
            )
          ))}
        </main>
      </div>
    </Layout>
  );
}
