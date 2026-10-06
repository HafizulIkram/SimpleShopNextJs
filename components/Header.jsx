"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";

export default function Header() {
  const { status } = useSession();

  return (
    <header className="site-header">
      <Link href="/" className="brand">Simple Shop</Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/cached-products">Static Products</Link>
        <Link href="/new-arrivals">Dynamic Products</Link>
        <Link href="/search">Search</Link>
        <Link href="/cart">Cart</Link>
        {status === "authenticated" ? (
          <>
            <Link href="/admin">Admin</Link>
            <SignOutButton />
          </>
        ) : status === "unauthenticated" ? (
          <Link href="/signin">Sign in</Link>
        ) : null}
      </nav>
    </header>
  );
}
