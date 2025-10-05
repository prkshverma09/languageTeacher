"use client";

import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        Language Tutor
      </Link>
      <AuthStatus />
    </header>
  );
}