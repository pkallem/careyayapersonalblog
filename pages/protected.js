import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Button, Heading, Flex } from '@chakra-ui/react';

import Layout from '../components/layout';
import CreateBlogPopup from '../components/CreateBlogPopup';
import EditBlogPopup from '../components/EditBlogPopup';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';  // import the new component

export default function ProtectedPage() {
  const { data: session } = useSession();
  const [apiResult, setApiResult] = useState([]);
  
  const [blogBeingEdited, setBlogBeingEdited] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);  
  const [blogToDelete, setBlogToDelete] = useState(null);  
  const user_id = session?.user?.id;
  const author = session?.user?.name;

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`hhttps://careyayapersonalblog.vercel.app/api/hello`);
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleAddBlog = async (title, content) => {
    try {
      const response = await fetch('https://careyayapersonalblog.vercel.app/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, user_id, author }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteBlog = (id) => {  
    setBlogToDelete(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {  
    if (blogToDelete === null) return;

    try {
      const response = await fetch('https://careyayapersonalblog.vercel.app/api/hello', {
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

  const handleEditBlog = async (id, newTitle, newContent) => {
    try {
      const response = await fetch('https://careyayapersonalblog.vercel.app/api/hello', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newTitle, newContent, user_id, author }),
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
        <Heading>You must be logged in to view your blogs</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex direction="column" align="center">
        {showCreatePopup && <CreateBlogPopup onClose={() => setShowCreatePopup(false)} onAddBlog={handleAddBlog} />}
        {showEditPopup && blogBeingEdited && <EditBlogPopup blog={blogBeingEdited} onClose={() => setShowEditPopup(false)} onEditBlog={handleEditBlog} />}
        {showDeletePopup && <DeleteConfirmationPopup onClose={() => setShowDeletePopup(false)} onConfirm={handleConfirmDelete} />}  
        <Button onClick={() => setShowCreatePopup(true)} colorScheme="teal" size="lg" mt={6} mb={5}>Create new blog</Button>
        {apiResult.map((blog) => (
          blog.user_id == user_id && (
            <Box 
              key={blog.id} 
              p={5} 
              shadow="lg" 
              borderWidth={1} 
              borderRadius="lg"
              position="relative"
              h="150px" 
              width="80%"
              maxWidth="700px"
              mb={6}
            >
              <Heading fontSize="xl" isTruncated>{blog.title}</Heading>
              <Flex direction="row" position="absolute" bottom="5" right="5">
                <Button 
                  onClick={() => {
                    setBlogBeingEdited(blog);
                    setShowEditPopup(true);
                  }}
                  colorScheme="blue"
                  mr={3}
                >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDeleteBlog(blog.id)} 
                  colorScheme="red"
                >
                  Delete
                </Button>
              </Flex>  
            </Box>
          )
        ))}
      </Flex>
    </Layout>
  );
}