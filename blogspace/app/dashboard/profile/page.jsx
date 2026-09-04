"use client";

import { useRef, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import Avatar from "@/components/Avatar";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { updateOwnProfile, updateProfileImage } from "@/services/user.service";
import { getErrorMessage } from "@/services/api";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function ProfileContent() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [errors, setErrors] = useState({});
  const [profileError, setProfileError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, WEBP or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be smaller than 2MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setImageError("");
    try {
      await updateProfileImage(selectedFile);
      await refreshProfile();
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setImageError(getErrorMessage(err, "Couldn't upload this image."));
    } finally {
      setUploading(false);
    }
  }

  function validateProfile() {
    const next = {};
    if (!firstname.trim()) next.firstname = "First name is required.";
    if (!lastname.trim()) next.lastname = "Last name is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileNotice("");
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      await updateOwnProfile({ firstname: firstname.trim(), lastname: lastname.trim() });
      await refreshProfile();
      setProfileNotice("Profile updated.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "Couldn't update your profile."));
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink-900 mb-6">Profile</h1>

        <div className="border border-ink-200 rounded-lg bg-white p-6">
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-[72px] h-[72px] rounded-full object-cover border border-ink-200"
              />
            ) : (
              <Avatar user={user} size={72} />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-800">Profile photo</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="text-sm px-3 py-1.5 rounded-md border border-ink-200 hover:bg-ink-50 cursor-pointer">
                  Choose image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="text-sm px-3 py-1.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
          {imageError && <p className="mt-3 text-sm text-clay-600">{imageError}</p>}
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <Alert type="error">{profileError}</Alert>
        <Alert type="success">{profileNotice}</Alert>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-ink-700 mb-1.5">
              First name
            </label>
            <input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
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
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
            />
            {errors.lastname && <p className="mt-1 text-xs text-clay-600">{errors.lastname}</p>}
          </div>
        </div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
    <input
      value={user?.email || ""}
      readOnly
      className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2.5 text-sm text-ink-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-ink-700 mb-1.5">Role</label>
    <input
      value={user?.role || ""}
      readOnly
      className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2.5 text-sm text-ink-500 capitalize"
    />
  </div>
</div>

        <button
          type="submit"
          disabled={savingProfile}
          className="px-6 py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
        >
          {savingProfile ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <ProfileContent />
    </DashboardShell>
  );
}
