import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

/* ================= IMAGE UPLOADER COMPONENT ================= */
function ImageUploader({ label, image, setImage }) {
  return (
    <div>
      <label className="block font-medium mb-2 text-gray-700">{label}</label>

      <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
        {image ? (
          <>
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="h-40 object-contain mb-3 rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setImage(null);
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Remove image
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-1">Click to upload image</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function AddBlog() {
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [infographImage, setInfographImage] = useState(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async function uploadImage(file) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogimage");

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );

    return res.data.secure_url;
  }

  async function submit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    try {
      const finalSlug = slug || generateSlug(title);

      const cardImageUrl = cardImage ? await uploadImage(cardImage) : "";

      const infographImageUrl = infographImage
        ? await uploadImage(infographImage)
        : "";

      const res = await fetch("/api/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          desc,
          content,
          cardImage: cardImageUrl,
          infographImage: infographImageUrl,
          seoTitle: metaTitle || title,
          seoDescription: metaDesc || desc.slice(0, 150),
          slug: finalSlug,
          author: session.user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to publish blog");

      alert("Blog published successfully!");

      setTitle("");
      setDesc("");
      setContent("");
      setCardImage(null);
      setInfographImage(null);
      setMetaTitle("");
      setMetaDesc("");
      setSlug("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout dashboard>
      <div className="max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Blog</h1>

        <form onSubmit={submit} className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short Description"
            rows="3"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />

          <ImageUploader
            label="Blog Card Image"
            image={cardImage}
            setImage={setCardImage}
          />

          <ImageUploader
            label="Infographic Image"
            image={infographImage}
            setImage={setInfographImage}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog Content"
            rows="10"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta Title"
              className="w-full p-3 border rounded"
            />

            <input
              type="text"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta Description"
              className="w-full p-3 border rounded"
            />

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Custom Slug (optional)"
              className="w-full p-3 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
