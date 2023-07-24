import Layout from '../../components/layout';
import { Box, Heading, Image, VStack, Divider, Textarea, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Portfolio({ user_id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://careyayapersonalblog.vercel.app/api/userinfo?user_id=${user_id}`);
      const data = await res.json();
      setUser(data.userinfo);
    };

    fetchData();
  }, [user_id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <VStack pt={10} alignItems="start" spacing={8} px={4} maxW="800px" w="100%" m="0 auto">
        <Box w="100%">
          <Heading size="lg" alignSelf="center" fontWeight="bold" mb={3} isTruncated={false}>
            {data.bio}
          </Heading>
        </Box>
        <Image boxSize="100px" src={user.image} alt={user.name} />
      </VStack>
    </Layout>
  );
}

Portfolio.getInitialProps = async ({ query }) => {
  return { user_id: query.user_id }
}
