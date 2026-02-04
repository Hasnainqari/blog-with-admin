import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Profile() {
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Success", "Profile updated successfully", "success");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout dashboard>
      <div className="max-w-xl py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={session?.user?.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>

          <hr />

          <h3 className="font-semibold">Change Password</h3>

          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <button
            disabled={loading}
            className={`w-full py-3 rounded text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
