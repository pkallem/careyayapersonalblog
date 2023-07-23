import Layout from '../components/layout';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';

export async function getStaticPaths() {
  const server = 'http://localhost:3000'

  const res = await fetch(`${server}/api/hello`);
  const data = await res.json();
  const blogs = data.blogs;

  const paths = blogs.map((blog) => ({
    params: { id: blog.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const server = 'http://localhost:3000'

  const res = await fetch(`${server}/api/hello?id=${params.id}`);
  const data = await res.json();
  const blog = data.blog;

  return { props: { blog } };
}

export default function Blog({ blog }) {
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