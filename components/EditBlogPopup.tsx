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
  onEditBlog: (id: number, newTitle: string, newContent: string) => void;
}

export default function EditBlogPopup({ blog, onClose, onEditBlog }: EditBlogPopupProps) {
  const [newTitle, setNewTitle] = useState(blog.title);
  const [newContent, setNewContent] = useState(blog.content);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewContent(e.target.value);
  const handleEditBlog = () => {
    onEditBlog(blog.id, newTitle, newContent);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupHeading}>Edit Blog</h2>
        <input
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
          placeholder="Edit the blog title"
        />
        <textarea
          value={newContent}
          onChange={handleContentChange}
          placeholder="Edit the blog content"
        />
        <button onClick={handleEditBlog}>Save Changes</button>
      </div>
    </div>
  );
}
