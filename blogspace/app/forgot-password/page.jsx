"use client";

import { useState } from "react";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import Alert from "@/components/Alert";
import { forgotPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/services/api";
import { isValidEmail } from "@/utils/validation";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await forgotPassword(email.trim());
      setNotice(res.message || "If an account with that email exists, a password reset link has been sent.");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't process your request."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h1 className="font-display text-3xl text-ink-900">Forgot your password?</h1>
      <p className="mt-2 text-ink-500 text-sm">
        Enter the email on your account and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{notice}</Alert>

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
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-500">
        Remembered your password?{" "}
        <Link href="/login" className="text-moss-700 font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <PublicShell>
      <ForgotPasswordForm />
    </PublicShell>
  );
}
