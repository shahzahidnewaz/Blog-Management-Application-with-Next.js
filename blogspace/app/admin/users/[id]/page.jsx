"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { getUserById } from "@/services/user.service";
import { getErrorMessage } from "@/services/api";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function UserDetailContent() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getUserById(id)
      .then((res) => {
        if (active) setUser(res.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load this user."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="max-w-lg">
      <Link href="/admin/users" className="text-sm text-moss-700 hover:underline">
        &larr; Back to users
      </Link>

      <h1 className="font-display text-2xl text-ink-900 mt-3 mb-6">User details</h1>

      {loading && <Loader label="Loading user..." />}
      {!loading && error && <EmptyState title="User not found" description={error} />}

      {!loading && !error && user && (
        <div className="border border-ink-200 rounded-lg bg-white p-6">
          <div className="flex items-center gap-4">
            <Avatar user={user} size={64} />
            <div>
              <p className="font-display text-lg text-ink-900">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-sm text-ink-500">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-ink-400">Role</dt>
            <dd className="text-ink-800 capitalize">{user.role}</dd>
            <dt className="text-ink-400">Status</dt>
            <dd className="text-ink-800">{user.isActive ? "Active" : "Inactive"}</dd>
            <dt className="text-ink-400">Created</dt>
            <dd className="text-ink-800">{formatDate(user.createAt)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}

export default function AdminUserDetailPage() {
  return (
    <DashboardShell requireAdmin>
      <UserDetailContent />
    </DashboardShell>
  );
}
