import Layout from '../components/layout';

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

export async function getStaticPaths() {
  try {
    const res = await fetch('http://localhost:3000/api/hello');
    const { blogs } = await res.json();

    return { 
      paths: blogs.map(({ id }: Blog) => ({ params: { id: id.toString() } })), 
      fallback: false 
    };
  } catch (error) {
    console.error(error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`http://localhost:3000/api/hello?id=${params.id}`);
    const { blog } = await res.json();

    return { props: { blog } };
  } catch (error) {
    console.error(error);
    return { props: { blog: null } };
  }
}

export default function Blog({ blog }: { blog: Blog }) {
  if (!blog) return <div>Loading...</div>;
  return (
    <Layout>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>{blog.user_id}</p>
    </Layout>
  );
}
