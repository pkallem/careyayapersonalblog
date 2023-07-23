import Layout from '../components/layout';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Blog({ id }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // Fetch the blog data when the component mounts
    const fetchData = async () => {
      const res = await fetch(`https://careyayapersonalblog.vercel.app/api/hello?id=${id}`);
      const data = await res.json();
      setBlog(data.blog);
    };

    fetchData();
  }, [id]); // Re-fetch when the id changes

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <VStack pt={10} alignItems="start" spacing={8} px={4} maxW="800px" w="100%" m="0 auto">
        <Box w="100%">
          <Heading size="lg" alignSelf="center" fontWeight="bold" mb={3} isTruncated={false}>
            {blog.title}
          </Heading>
        </Box>
        <Text fontSize="lg" color="gray.500">{`Author: ${blog.author}`}</Text>
        <Divider />
        <Text fontSize="md" my={4} lineHeight="1.6">{blog.content}</Text>
      </VStack>
    </Layout>
  );
}

// This function gets called at build time to resolve the list of ids
Blog.getInitialProps = async ({ query }) => {
  // query.id contains the id for each rendered page
  return { id: query.id }
}
