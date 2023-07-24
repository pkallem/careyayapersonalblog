import Layout from '../../components/layout';
import { Box, Heading, Text, VStack, Divider, Image, Textarea, Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Portfolio({ user_id, author }) {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const { data: session } = useSession();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://careyayapersonalblog.vercel.app/api/userinfo?user_id=${user_id}`);
      const data = await res.json();
      setUser(data.userinfo);
      setBio(data.userinfo.bio);
      setResumeLink(data.userinfo.resume_link);
    };

    fetchData();
  }, [user_id]);

  const updateUserInfo = async () => {
    const res = await fetch(`https://careyayapersonalblog.vercel.app/api/userinfo?user_id=${user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: user_id, bio: bio, resume_link: resumeLink })
    });

    const data = await res.json();
    if (data.message) {
      alert(data.message);
    }
    setEdit(false); // Hide the edit fields after updating
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <VStack pt={10} alignItems="start" spacing={8} px={4} maxW="800px" w="100%" m="0 auto">
        <Box w="100%">
          <Heading size="lg" alignSelf="center" fontWeight="bold" mb={3}>
            {`${author}'s Portfolio`}
          </Heading>
        </Box>
        <Divider />
        <Box w="100%" my={4}>
          <Heading size="md" fontWeight="bold" mb={3}>Bio:</Heading>
          <Text fontSize="md" lineHeight="1.6">{bio}</Text>
        </Box>
        <Box w="100%">
          <Heading size="md" fontWeight="bold" mb={3}>Resume/CV:</Heading>
          <iframe src={resumeLink} title="Resume" style={{ width: '100%', height: '1056px' }} />
        </Box>
        {session && session.user.id === user_id && (
          <Box w="100%">
            <Button colorScheme="teal" onClick={() => setEdit(!edit)}>Edit</Button>
            {edit && (
              <VStack mt={3}>
                <Heading size="md" fontWeight="bold" mb={3}>Update Your Info:</Heading>
                <Textarea placeholder="Update your bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                <Input placeholder="Update your resume link" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
                <Button colorScheme="teal" onClick={updateUserInfo}>Update</Button>
              </VStack>
            )}
          </Box>
        )}
      </VStack>
    </Layout>
  );
}

Portfolio.getInitialProps = async ({ query }) => {
  return { user_id: query.user_id, author: query.author }
}
