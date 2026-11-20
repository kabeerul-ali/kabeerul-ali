
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Common API Request Handler
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),

    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("adminToken");
    }

    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

// Authentication APIs
export const authAPI = {
  login: (credentials) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiRequest("/api/auth/me"),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => apiRequest("/api/profile"),

  updateProfile: (profileData) =>
    apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
};

// Projects CRUD APIs
export const projectAPI = {
  getAll: () => apiRequest("/api/projects/admin/all"),

  getById: (id) =>
    apiRequest(`/api/projects/${id}`),

  create: (projectData) =>
    apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  update: (id, projectData) =>
    apiRequest(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    }),

  delete: (id) =>
    apiRequest(`/api/projects/${id}`, {
      method: "DELETE",
    }),
};

// Skills CRUD APIs
export const skillAPI = {
  getAll: () => apiRequest("/api/skills/admin/all"),

  create: (skillData) =>
    apiRequest("/api/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    }),

  update: (id, skillData) =>
    apiRequest(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(skillData),
    }),

  delete: (id) =>
    apiRequest(`/api/skills/${id}`, {
      method: "DELETE",
    }),
};

// Contact / Messages APIs
export const messageAPI = {
  getAll: () =>
    apiRequest("/api/contact/admin/all"),

  getById: (id) =>
    apiRequest(`/api/contact/${id}`),

  delete: (id) =>
    apiRequest(`/api/contact/${id}`, {
      method: "DELETE",
    }),
};

export default API_BASE_URL;
