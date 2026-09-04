"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import { isValidEmail } from "@/utils/validation";

const initialForm = { firstname: "", lastname: "", email: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.firstname.trim()) next.firstname = "First name is required.";
    if (!form.lastname.trim()) next.lastname = "Last name is required.";
    if (!isValidEmail(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      router.push("/login?registered=1");
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <div className="max-w-md mx-auto px-4 py-14">
        <h1 className="font-display text-3xl text-ink-900">Create your account</h1>
        <p className="mt-2 text-ink-500 text-sm">Join BlogSpace to write and manage your own blogs.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Alert type="error">{submitError}</Alert>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-ink-700 mb-1.5">
                First name
              </label>
              <input
                id="firstname"
                value={form.firstname}
                onChange={update("firstname")}
                className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
              />
              {errors.firstname && <p className="mt-1 text-xs text-clay-600">{errors.firstname}</p>}
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-ink-700 mb-1.5">
                Last name
              </label>
              <input
                id="lastname"
                value={form.lastname}
                onChange={update("lastname")}
                className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
              />
              {errors.lastname && <p className="mt-1 text-xs text-clay-600">{errors.lastname}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="name@example.com"
              className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
            />
            {errors.email && <p className="mt-1 text-xs text-clay-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
            />
            {errors.password && <p className="mt-1 text-xs text-clay-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-clay-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="text-moss-700 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
