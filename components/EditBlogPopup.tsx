import React, { useState } from 'react';
import styles from '../styles/CreateBlogPopup.module.css';

interface Blog {
  id: number;
  title: string;
  content: string;
}

interface EditBlogPopupProps {
  blog: Blog;
  onClose: () => void;
  onEditBlog: (id: number, title: string, content: string) => void;
}

export default function EditBlogPopup({ blog, onClose, onEditBlog }: EditBlogPopupProps) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const editBlog = () => {
    onEditBlog(blog.id, title, content);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupHeading}>Edit Blog</h2>
        <input type="text" value={title} onChange={handleTitleChange} placeholder="Edit the blog title" />
        <textarea value={content} onChange={handleContentChange} placeholder="Edit the blog content" />
        <button onClick={editBlog}>Save Changes</button>
      </div>
    </div>
  );
}