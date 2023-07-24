import Layout from '../components/layout';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Blog({ id }) {

  return (
    <Layout>
      <VStack pt={10} alignItems="start" spacing={8} px={4} maxW="800px" w="100%" m="0 auto">
        <Text fontSize="md" my={4} lineHeight="1.6">{id}</Text>
      </VStack>
    </Layout>
  );
}


Blog.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
