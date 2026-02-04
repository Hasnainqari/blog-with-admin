import Head from "next/head";
import dbConnect from "../../lib/db";
import Blog from "../../models/Blog";
import Link from "next/link";

export default function BlogPage({ blog }) {
  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-red-600">Blog not found</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.seoTitle || blog.title}</title>
        <meta name="description" content={blog.seoDescription || blog.desc} />
        <link rel="canonical" href={`/blog/${blog.slug}`}></link>
      </Head>
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MyBlog</h1>
          <nav className="space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600">
              Blogs
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      </header>
      <article className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        {blog.cardImage && (
          <img
            src={blog.cardImage}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        )}

        <p className="text-gray-600 mb-6">{blog.desc}</p>

        <div className="prose max-w-none">{blog.content}</div>
      </article>
      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} MyBlog. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  const blog = await Blog.findOne({ slug: params.slug });

  return {
    props: {
      blog: blog ? JSON.parse(JSON.stringify(blog)) : null,
    },
  };
}
