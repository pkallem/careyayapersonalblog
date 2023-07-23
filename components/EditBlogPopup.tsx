import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input
} from "@chakra-ui/react";

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
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Blog</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Blog Title</FormLabel>
            <Input 
              placeholder="Edit the blog title" 
              value={newTitle} 
              onChange={handleTitleChange} 
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Blog Content</FormLabel>
            <Textarea 
              placeholder="Edit the blog content" 
              value={newContent} 
              onChange={handleContentChange}
              size="md"
              maxH="150px"
              overflowY="auto"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleEditBlog}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
