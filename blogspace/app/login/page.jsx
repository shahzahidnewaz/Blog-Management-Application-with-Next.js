"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import { isValidEmail } from "@/utils/validation";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams?.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h1 className="font-display text-3xl text-ink-900">Welcome back</h1>
      <p className="mt-2 text-ink-500 text-sm">Login to manage your blogs.</p>

      {justRegistered && (
        <div className="mt-6">
          <Alert type="success">Account created. Login with your new credentials.</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Alert type="error">{submitError}</Alert>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
          />
          {errors.email && <p className="mt-1 text-xs text-clay-600">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-ink-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-moss-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
          />
          {errors.password && <p className="mt-1 text-xs text-clay-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-moss-700 font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="py-14" />}>
        <LoginForm />
      </Suspense>
    </PublicShell>
  );
}
