import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';
import { useSession } from 'next-auth/react';
import { Box, Heading, Text, Grid, Flex } from '@chakra-ui/react';

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author: string;
}

interface HomeProps { }

export default function Home(props: HomeProps) {
  const { data: session, status } = useSession();
  const [apiResult, setApiResult] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/hello`);
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Layout>
      <Flex direction="column" align="start" width="80%" maxWidth="700px" m="0 auto">
        <Heading as="h1" size="2xl" mt={6} mb={6}>Feed</Heading>
        {apiResult.map((blog) => (
          <Box 
            key={blog.id} 
            p={5} 
            shadow="lg" 
            borderWidth={1} 
            borderRadius="lg"
            overflow="auto"
            h="200px" 
            width="100%"
            mb={6}
          >
            <Link href={`/${blog.id}`}>
              <Heading fontSize="xl" noOfLines={4}>{blog.title}</Heading>
            </Link>
            <Text mt={4}>{blog.author}</Text>
          </Box>
        ))}
      </Flex>
    </Layout>
  );
}
