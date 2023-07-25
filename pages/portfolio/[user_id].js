import React from 'react';
import Layout from '../../components/layout';
import { Box, Heading, Text, VStack, Divider, Textarea, Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Portfolio({ user_id, author }) {
  const [user, setUser] = useState(null); // state to store user
  const [bio, setBio] = useState(''); // state to store bio
  const [resumeLink, setResumeLink] = useState(''); // state to store resume link
  const { data: session } = useSession(); // auth session
  const [edit, setEdit] = useState(false); // allow editing

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
    setEdit(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const createMarkup = (text) => {
    let replacedText = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Replace **bold text** with <strong>bold text</strong>
      .replace(/__(.+?)__/g, '<strong>$1</strong>') // Replace __bold text__ with <strong>bold text</strong>
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Replace *italic text* with <em>italic text</em>
      .replace(/_(.+?)_/g, '<em>$1</em>') // Replace _italic text_ with <em>italic text</em>
      .replace(/~~(.+?)~~/g, '<u>$1</u>') // Replace ~~underline text~~ with <u>underline text</u>
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>') // Replace [Link text](URL) with <a href="URL">Link text</a>

    // Replace newline characters with <br/>
    replacedText = replacedText.replace(/\n/g, '<br/>')

    return { __html: replacedText };
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
        {session && session.user.id === user_id && (
          <Box w="100%" mb={8}>
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
        <Box w="100%" my={4}>
          <Heading size="md" fontWeight="bold" mb={3}>About Me</Heading>
          <Text fontSize="md" lineHeight="1.6" dangerouslySetInnerHTML={createMarkup(bio)} />
        </Box>
        <Heading size="md" fontWeight="bold" mb={3}>Resume/CV:</Heading>
        <Box w="100%" position="relative" pb={5} >
          <iframe src={resumeLink} title="Resume" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        </Box>

      </VStack>
    </Layout>
  );
}

Portfolio.getInitialProps = async ({ query }) => {
  return { user_id: query.user_id, author: query.author }
}
