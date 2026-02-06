import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Blogs() {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBlogs() {
    const res = await fetch("/api/blogs");

    // 🔐 Handle unauthorized (VERY IMPORTANT)
    if (res.status === 401) {
      window.location.href = "/auth/login";
      return;
    }

    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchBlogs();
    }
  }, [status]);
  async function deleteBlog(id) {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      Swal.fire("Deleted!", "Blog has been deleted.", "success");
      fetchBlogs();
    } else {
      Swal.fire("Error", "Failed to delete blog", "error");
    }
  }

  return (
    <Layout dashboard>
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Author</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Published</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog) => {
              const isOwner = session?.user?.id === blog.author?._id;
              const isAdmin = session?.user?.role === "admin";

              return (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{blog.title}</td>
                  <td className="px-6 py-4">
                    {blog.author
                      ? `${blog.author.name || blog.author.email} (${blog.author.role})`
                      : "Unknown Author"}
                  </td>
                  <td className="px-6 py-4">{blog.slug}</td>
                  <td className="px-6 py-4">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    {(isAdmin || isOwner) && (
                      <>
                        <Link
                          href={`/dashboard/blogs/edit/${blog._id}`}
                          className="text-blue-600 cursor-pointer"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="text-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
