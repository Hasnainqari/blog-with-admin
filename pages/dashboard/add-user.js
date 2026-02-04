import { requireAdmin } from "@/lib/requireAdmin";
import Layout from "../../components/Layout";
import { useState } from "react";


export async function getServerSideProps(ctx) {
  return requireAdmin(ctx);
}


export default function AddUser() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // store generated credentials (shown once)
  const [createdUser, setCreatedUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setCreatedUser(null); // reset old data

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      // store credentials temporarily
      setCreatedUser({
        email: data.email,
        password: data.password,
      });

      setEmail("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyPassword() {
    navigator.clipboard.writeText(createdUser.password);
    alert("Password copied to clipboard");
  }

  return (
    <Layout dashboard>
      <div className="max-w-lg mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Add New User</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        {/* 🔐 ONE-TIME CREDENTIAL BOX */}
        {createdUser && (
          <div className="mt-6 border border-green-300 bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              User Created Successfully
            </h2>

            <p className="text-sm text-gray-700 mb-1">
              <strong>Email:</strong> {createdUser.email}
            </p>

            <div className="flex items-center justify-between bg-white border rounded px-3 py-2 mt-2">
              <span className="font-mono text-sm">{createdUser.password}</span>
              <button
                onClick={copyPassword}
                className="ml-3 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-red-600 mt-3">
              ⚠️ This password is shown only once. Please copy and share it
              securely with the user.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
