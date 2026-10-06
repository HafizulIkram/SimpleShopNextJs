"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        username: form.get("username"),
        password: form.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Username or password is incorrect.");
      } else {
        router.push("/");
        router.refresh();
        return;
      }
    } catch {
      setError("Sign in is unavailable. Please try again.");
    }
    setLoading(false);
  }

  return (
    <section className="auth-box">
      <h1>Admin sign in</h1>
      <p>Demo username: <strong>trainer</strong> · password: <strong>hands-on</strong></p>
      <form onSubmit={handleSubmit}>
        <label>Username <input name="username" required /></label>
        <label>Password <input name="password" type="password" required /></label>
        {error && <p role="alert" className="error">{error}</p>}
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </section>
  );
}
