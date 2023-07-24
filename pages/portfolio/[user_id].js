import Layout from '../../components/layout';
import { Box, Heading, Image, VStack, Divider, Textarea, Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Portfolio({ user_id }) {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [resumeLink, setResumeLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://careyayapersonalblog.vercel.app/api/userinfo?user_id=${user_id}`);
      const data = await res.json();
      setUser(data.userinfo);
      console.log(user);
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
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Heading>{user.user_id}</Heading>
      <Box>{user.bio}</Box>
      <Box>
        <iframe src={resumeLink} title="Resume"></iframe>
      </Box>
      <Divider mt={5} mb={5} />
      <Box>
        <Heading mb={3}>Update Your Info:</Heading>
        <VStack spacing={3}>
          <Textarea placeholder="Update your bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <Input placeholder="Update your resume link" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
          <Button colorScheme="teal" onClick={updateUserInfo}>Update</Button>
        </VStack>
      </Box>
    </Layout>
  );
}

Portfolio.getInitialProps = async ({ query }) => {
  return { user_id: query.user_id }
}
