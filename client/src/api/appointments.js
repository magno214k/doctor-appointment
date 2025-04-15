export const getUserAppointments = async () => {
  const response = await axios.get("/api/appointments/user", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};
