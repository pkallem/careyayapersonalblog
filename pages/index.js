import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { FaRegClock } from 'react-icons/fa';

export default function Home(props) {
  const [apiResult, setApiResult] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`https://careyayapersonalblog.vercel.app/api/hello`);
      const data = await response.json();
      setApiResult(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const readingTime = (content) => {
    const wordsPerMinute = 100;
    let textLength = content.split(' ').length;
    if(textLength > 0){
      let value = Math.ceil(textLength / wordsPerMinute);
      return `~${value} mins`;
    }
    return "< 1 min";
  };

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
            h="150px" 
            width="100%"
            mb={6}
          >
            <Link href={`/${blog.id}`}>
              <Heading fontSize="xl" noOfLines={2}>{blog.title}</Heading>
              <Text mt={4}>{blog.author} |               
              <Flex align="center">
                <FaRegClock size="1em" />
                <Text ml={2}>{readingTime(blog.content)}</Text>
              </Flex>
              </Text>

            </Link>
          </Box>
        ))}
      </Flex>
    </Layout>
  );
}
