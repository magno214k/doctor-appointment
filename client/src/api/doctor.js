import axios from "axios";

export const getDoctorSchedule = async () => {
  const response = await axios.get("/api/doctor/schedule", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const updateAvailability = async (slots) => {
  await axios.post(
    "/api/doctor/availability",
    { slots },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
