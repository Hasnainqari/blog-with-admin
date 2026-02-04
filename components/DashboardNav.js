import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardNav() {
  return (
    <nav style={{ padding: 20, borderBottom: "1px solid #ddd" }}>
      <Link href="/dashboard">Dashboard</Link>
      {" | "}
      <Link href="/dashboard/blogs">Blogs</Link>
      {" | "}
      <Link href="/dashboard/users">Users</Link>
      {" | "}
      <button onClick={() => signOut()} style={{ marginLeft: 10 }}>
        Logout
      </button>
    </nav>
  );
}
