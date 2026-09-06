import api from "./api";

export const getOwnProfile = () =>
  api.get("/api/users/profile").then((res) => res.data);

export const updateOwnProfile = (payload) =>
  api.put("/api/users/profile/update", payload).then((res) => res.data);

export const updateOwnPassword = (currentPassword, password) =>
  api.patch("/api/users/password", { currentPassword, password }).then((res) => res.data);

export const updateProfileImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .patch("/api/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const getAllUsers = () =>
  api.get("/api/users").then((res) => res.data);

export const getUserById = (id) =>
  api.get(`/api/users/${id}`).then((res) => res.data);

export const updateUserStatus = (id, isActive) =>
  api.patch(`/api/users/${id}/status`, { isActive }).then((res) => res.data);
