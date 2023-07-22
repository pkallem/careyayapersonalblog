import React, { useState } from 'react';
import styles from '../styles/CreateBlogPopup.module.css';

interface CreateBlogPopupProps {
  onClose: () => void;
  onAddBlog: (title: string, content: string) => void;
}

export default function CreateBlogPopup({ onClose, onAddBlog }: CreateBlogPopupProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const addBlog = () => {
    onAddBlog(title, content);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupHeading}>Add New Blog</h2>
        <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter the blog title" />
        <textarea value={content} onChange={handleContentChange} placeholder="Enter the blog content" />
        <button onClick={addBlog}>Add Blog</button>
      </div>
    </div>
  );
}
