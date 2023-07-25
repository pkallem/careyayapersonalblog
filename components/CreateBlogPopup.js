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

export default function CreateBlogPopup({ onClose, onAddBlog }) {
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogContent, setBlogContent] = useState<string>('');

  const handleTitleChange = (e) => setBlogTitle(e.target.value);
  const handleContentChange = (e) => setBlogContent(e.target.value);
  
  const handleAddBlog = () => {
    onAddBlog(blogTitle, blogContent);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Blog</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Blog Title</FormLabel>
            <Input 
              placeholder="Enter the blog title" 
              value={blogTitle} 
              onChange={handleTitleChange} 
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Blog Content</FormLabel>
            <Textarea 
              placeholder="Enter the blog content" 
              value={blogContent} 
              onChange={handleContentChange}
              size="md"
              maxHeight="150px"
              overflowY="auto"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddBlog}>
            Add Blog
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
