import Layout from '../components/layout';

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
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>{blog.user_id}</p>
    </Layout>
  );
}

