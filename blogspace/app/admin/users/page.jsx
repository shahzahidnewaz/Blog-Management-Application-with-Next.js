"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Alert from "@/components/Alert";
import { getAllUsers, updateUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/services/api";

function UsersContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  function load() {
    setLoading(true);
    setError("");
    getAllUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load users.")))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleToggleStatus() {
    if (!pendingUser) return;
    setUpdating(true);
    try {
      const nextActive = !pendingUser.isActive;
      await updateUserStatus(pendingUser.id, nextActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === pendingUser.id ? { ...u, isActive: nextActive } : u))
      );
      setPendingUser(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't update this user's status."));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-900 mb-6">Users</h1>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="border border-ink-200 rounded-lg bg-white overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-ink-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar user={u} size={28} />
                      <span className="text-ink-800">
                        {u.firstname} {u.lastname}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{u.email}</td>
                  <td className="px-4 py-3 text-ink-500 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.isActive
                          ? "bg-moss-50 text-moss-700 border border-moss-100"
                          : "bg-clay-50 text-clay-700 border border-clay-100"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/users/${u.id}`} className="text-sm text-ink-600 hover:underline">
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingUser(u)}
                        className="text-sm text-moss-700 hover:underline"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingUser)}
        title={pendingUser?.isActive ? "Deactivate this user?" : "Activate this user?"}
        description={
          pendingUser?.isActive
            ? `${pendingUser?.firstname} ${pendingUser?.lastname} will no longer be able to log in.`
            : `${pendingUser?.firstname} ${pendingUser?.lastname} will regain access.`
        }
        confirmLabel={pendingUser?.isActive ? "Deactivate" : "Activate"}
        danger={pendingUser?.isActive}
        busy={updating}
        onConfirm={handleToggleStatus}
        onCancel={() => setPendingUser(null)}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <DashboardShell requireAdmin>
      <UsersContent />
    </DashboardShell>
  );
}
