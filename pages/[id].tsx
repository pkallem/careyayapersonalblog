import { useRouter } from 'next/router';
import Layout from '../components/layout';

export async function getStaticPaths() {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_VERCEL_URL;

  const res = await fetch(`${server}/api/hello`);
  const data = await res.json();
  const blogs = data.blogs;

  const paths = blogs.map((blog) => ({
    params: { id: blog.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_VERCEL_URL;

  const res = await fetch(`${server}/api/hello?id=${params.id}`);
  const blog = await res.json();

  return { props: { blog } };
}

export default function Blog({ blog }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
    </Layout>
  );
}
