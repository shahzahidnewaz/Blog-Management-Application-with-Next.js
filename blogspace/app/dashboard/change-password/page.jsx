"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import Alert from "@/components/Alert";
import { updateOwnPassword } from "@/services/user.service";
import { getErrorMessage } from "@/services/api";

function ChangePasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setNotice("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateOwnPassword(password);
      setNotice("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Couldn't change your password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl text-ink-900 mb-6">Change password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert type="error">{submitError}</Alert>
        <Alert type="success">{notice}</Alert>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
          />
          {errors.password && <p className="mt-1 text-xs text-clay-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-clay-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
        >
          {submitting ? "Changing..." : "Change password"}
        </button>
      </form>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <DashboardShell>
      <ChangePasswordContent />
    </DashboardShell>
  );
}
