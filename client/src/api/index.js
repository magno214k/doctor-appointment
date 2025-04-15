import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default {
  // Auth
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  verifyToken: (token) => api.get("/auth/verify"),

  // Doctors
  getDoctors: (params) => api.get("/doctors", { params }),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  createDoctor: (data) => api.post("/doctors", data),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),

  // Appointments
  getAppointments: (params) => api.get("/appointments", { params }),
  createAppointment: (data) => api.post("/appointments", data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),

  // Users
  updateProfile: (data) => api.put("/users/profile", data),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
