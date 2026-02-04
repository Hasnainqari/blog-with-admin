import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  async function updateBlog(e) {
    e.preventDefault();

    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      Swal.fire("Updated!", "Blog updated successfully", "success");
      router.push("/dashboard/blogs");
    } else {
      Swal.fire("Error", "Failed to update blog", "error");
    }
  }

  if (!form) return null;

  return (
    <Layout dashboard>
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      <form onSubmit={updateBlog} className="space-y-4 max-w-3xl">
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full p-3 border rounded"
        />

        <textarea
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          rows={10}
          className="w-full p-3 border rounded"
        />

        <button className="px-6 py-3 bg-blue-600 text-white rounded">
          Update Blog
        </button>
      </form>
    </Layout>
  );
}
