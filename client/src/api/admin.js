import axios from "axios";

export const getAdminStats = async () => {
  const response = await axios.get("/api/admin/stats", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const verifyDoctor = async (doctorId) => {
  await axios.patch(`/api/admin/verify-doctor/${doctorId}`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
