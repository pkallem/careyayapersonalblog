import React from "react";
import Layout from '../components/layout';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Blog({ id }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://careyayapersonalblog.vercel.app/api/hello?id=${id}`);
      const data = await res.json();
      setBlog(data.blog);
    };

    fetchData();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }


  const createMarkup = (text) => {
    return { __html: text.replace(/\n/g, '<br/>') };
  }

  return (
    <Layout>
      <VStack pt={10} alignItems="start" spacing={8} px={4} maxW="800px" w="100%" m="0 auto">
        <Box w="100%">
          <Heading size="lg" alignSelf="center" fontWeight="bold" mb={3} isTruncated={false}>
            {blog.title}
          </Heading>
        </Box>
        <Link href={`/portfolio/${blog.user_id}?author=${blog.author}`}>
          <Text fontSize="lg" color="gray.500" cursor="pointer" style={{ textDecoration: 'underline' }}>{`Author: ${blog.author}`}</Text>
        </Link>
        <Divider />
        {/* Render text with HTML */}
        <Text fontSize="md" my={4} lineHeight="1.6" dangerouslySetInnerHTML={createMarkup(blog.content)} />
      </VStack>
    </Layout>
  );
}

Blog.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
