import React, { useState } from 'react';
import styles from '../styles/CreateBlogPopup.module.css';

interface CreateBlogPopupProps {
  onClose: () => void;
  onAddBlog: (title: string, content: string) => void;
}

export default function CreateBlogPopup({ onClose, onAddBlog }: CreateBlogPopupProps) {
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogContent, setBlogContent] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setBlogTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBlogContent(e.target.value);
  const handleAddBlog = () => {
    onAddBlog(blogTitle, blogContent);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupHeading}>Add New Blog</h2>
        <input
          type="text"
          value={blogTitle}
          onChange={handleTitleChange}
          placeholder="Enter the blog title"
        />
        <textarea
          value={blogContent}
          onChange={handleContentChange}
          placeholder="Enter the blog content"
        />
        <button onClick={handleAddBlog}>Add Blog</button>
      </div>
    </div>
  );
}
