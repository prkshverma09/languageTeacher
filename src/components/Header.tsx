"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthStatus from "./AuthStatus";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        Language Tutor
      </Link>
      <div className="flex items-center gap-4">
        {session && (
          <Link
            href="/settings"
            className="text-gray-300 hover:text-white transition-colors"
          >
            ⚙️ Settings
          </Link>
        )}
        <AuthStatus />
      </div>
    </header>
  );
}
