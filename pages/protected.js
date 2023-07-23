import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Button, Heading, Flex } from '@chakra-ui/react';

import Layout from '../components/layout';
import CreateBlogPopup from '../components/CreateBlogPopup';
import EditBlogPopup from '../components/EditBlogPopup';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup'; 

const performFetch = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};

const BlogCard = ({ blog, onEdit, onDelete }) => (
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
        onClick={() => onEdit(blog)}
        colorScheme="blue"
        mr={3}
      >
        Edit
      </Button>
      <Button 
        onClick={() => onDelete(blog.id)} 
        colorScheme="red"
      >
        Delete
      </Button>
    </Flex>  
  </Box>
);

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
    const response = await performFetch('https://careyayapersonalblog.vercel.app/api/hello', 'GET');
    const data = await response.json();
    setApiResult(data.blogs);
  };

  const handleAddBlog = async (title, content) => {
    await performFetch('https://careyayapersonalblog.vercel.app/api/hello', 'POST', { title, content, user_id, author });
    fetchBlogs();
    setShowCreatePopup(false);
  };

  const handleDeleteBlog = (id) => {  
    setBlogToDelete(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {  
    if (blogToDelete === null) return;

    await performFetch('https://careyayapersonalblog.vercel.app/api/hello', 'DELETE', { id: blogToDelete, user_id });
    fetchBlogs();
    setBlogToDelete(null);
    setShowDeletePopup(false);
  };

  const handleEditBlog = async (id, newTitle, newContent) => {
    await performFetch('https://careyayapersonalblog.vercel.app/api/hello', 'PUT', { id, newTitle, newContent, user_id, author });
    fetchBlogs();
    setShowEditPopup(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [session]);

  return (
    <Layout>
      <Flex direction="column" align="center">
        {showCreatePopup && <CreateBlogPopup onClose={() => setShowCreatePopup(false)} onAddBlog={handleAddBlog} />}
        {showEditPopup && blogBeingEdited && <EditBlogPopup blog={blogBeingEdited} onClose={() => setShowEditPopup(false)} onEditBlog={handleEditBlog} />}
        {showDeletePopup && <DeleteConfirmationPopup onClose={() => setShowDeletePopup(false)} onConfirm={handleConfirmDelete} />}  
        <Button onClick={() => setShowCreatePopup(true)} colorScheme="teal" size="lg" mt={6} mb={5}>Create new blog</Button>
        {apiResult.map((blog) => (
          blog.user_id == user_id && (
            <BlogCard 
              blog={blog} 
              onEdit={(blog) => {
                setBlogBeingEdited(blog);
                setShowEditPopup(true);
              }} 
              onDelete={handleDeleteBlog}
            />
          )
        ))}
      </Flex>
    </Layout>
  );
}
