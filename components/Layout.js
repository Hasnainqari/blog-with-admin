import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Layout({ children, dashboard }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!dashboard) {
    // normal layout for public pages
    return <div>{children}</div>;
  }
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-center border-b">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">{session?.user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Dashboard Home
          </Link>
          {/* 🔐 ADMIN ONLY */}
          {isAdmin && (
            <div className="">
              <Link href="/dashboard/users">
                <div className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors">
                  Users
                </div>
              </Link>

              <Link href="/dashboard/add-user">
                <div className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors">
                  Add User
                </div>
              </Link>
            </div>
          )}
          <Link
            href="/dashboard/blogs"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Blogs
          </Link>
          {/* <Link
            href="/dashboard/activity"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Activity Log
          </Link> */}
          <Link
            href="/dashboard/add-blog"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Add New Blog
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full mt-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">
            {dashboard ? "Dashboard" : "Welcome"}
          </h1>
          <div className="text-gray-600">
            Logged in as:{" "}
            <span className="font-medium">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
