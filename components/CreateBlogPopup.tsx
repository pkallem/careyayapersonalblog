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
