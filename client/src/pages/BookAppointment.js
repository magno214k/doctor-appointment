import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button, Card, Spinner, DatePicker, Select } from "../components";
import api from "../api";
import { format } from "date-fns";

const BookAppointment = () => {
  const { id: doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const { data } = await api.getDoctor(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (date && doctor) {
      // Filter available slots based on doctor's availability and existing appointments
      const day = format(date, "EEEE"); // e.g., "Monday"
      if (doctor.availableDays.includes(day)) {
        setAvailableSlots(doctor.timeSlots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [date, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment({
        doctor: doctorId,
        date,
        timeSlot,
        reason,
      });
      navigate("/appointments");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <h2 className="text-2xl font-bold mb-6">
          Book Appointment with Dr. {doctor.user.firstName}{" "}
          {doctor.user.lastName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <DatePicker
              label="Select Date"
              selected={date}
              onChange={setDate}
              minDate={new Date()}
              filterDate={(date) => {
                const day = format(date, "EEEE");
                return doctor.availableDays.includes(day);
              }}
              required
            />
          </div>

          {date && (
            <div className="mb-4">
              <Select
                label="Select Time Slot"
                options={availableSlots.map((slot) => ({
                  value: slot,
                  label: slot,
                }))}
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reason for Visit</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={!date || !timeSlot}>
            Confirm Appointment
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;
