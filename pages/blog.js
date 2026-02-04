import Head from "next/head";
import Link from "next/link";
import dbConnect from "../lib/db";
import Blog from "../models/Blog";

export default function Home({ blogs }) {
  return (
    <>
      <Head>
        <title>Latest Blog</title>
        <meta name="description" content="SEO Blog Website" />
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

      {/* ===== HERO SECTION ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Post</h2>
          <p className="max-w-2xl mx-auto text-lg text-blue-100">
            Discover high-quality articles on technology, development, and
            modern web practices written by professionals.
          </p>
        </div>
      </section>

      {/* ===== BLOGS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-10 text-gray-800">Latest Blogs</h3>

        {blogs.length === 0 && (
          <p className="text-gray-500">No blogs published yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Blog Image */}
              {blog.cardImage && (
                <img
                  src={blog.cardImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h4>

                <p className="text-gray-600 text-sm mb-4">
                  {blog.desc
                    ? blog.desc.slice(0, 120)
                    : blog.content.slice(0, 120)}
                  ...
                </p>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

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

export async function getServerSideProps() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 }).limit(6);

  return {
    props: {
      blogs: JSON.parse(JSON.stringify(blogs)),
    },
  };
}
