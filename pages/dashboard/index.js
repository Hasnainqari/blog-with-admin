import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <Layout dashboard>
      <div className="min-h-screen flex bg-gray-100">
        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {session?.user?.name || session?.user?.email}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Users */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">Users</h3>
              <p className="text-2xl font-bold mt-2">42</p>
              <p className="text-sm text-gray-500 mt-1">
                Total registered users
              </p>
            </div>

            {/* Card: Blogs */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">Blogs</h3>
              <p className="text-2xl font-bold mt-2">15</p>
              <p className="text-sm text-gray-500 mt-1">Published blogs</p>
            </div>

            {/* Card: Activity */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Activity Log
              </h3>
              <p className="text-2xl font-bold mt-2">8</p>
              <p className="text-sm text-gray-500 mt-1">Recent actions</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      admin@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Published a new blog
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">2026-02-03</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      editor@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Added a new user
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">2026-02-02</td>
                  </tr>
                  {/* Add more rows dynamically from activity API */}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
