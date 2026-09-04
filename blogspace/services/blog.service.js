import api from "./api";

export const getAllBlogs = ({ title = "", category = "" } = {}) => {
  const params = {};
  if (title) params.title = title;
  if (category && category !== "All") params.category = category;
  return api.get("/api/blogs", { params }).then((res) => res.data);
};

export const getBlogById = (id) =>
  api.get(`/api/blogs/${id}`).then((res) => res.data);

export const createBlog = ({ blogTitle, blog, category }) =>
  api.post("/api/blogs/create", { blogTitle, blog, category }).then((res) => res.data);

export const updateBlog = (id, { blogTitle, blog, category }) =>
  api.put(`/api/blogs/update/${id}`, { blogTitle, blog, category }).then((res) => res.data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/delete/${id}`).then((res) => res.data);
