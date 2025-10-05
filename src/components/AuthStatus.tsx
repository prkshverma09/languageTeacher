"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-300">
          Signed in as {session.user?.name || session.user?.email}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
        Sign In
    </Link>
  );
}