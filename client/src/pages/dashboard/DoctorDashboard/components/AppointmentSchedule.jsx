import { useEffect, useState } from 'react';
import { getDoctorSchedule } from '../../../api/doctor';

const AppointmentSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const data = await getDoctorSchedule();
      setSchedule(data);
    };
    fetchSchedule();
  }, []);

  return (
    <div className="schedule-container">
      <h3>Today's Appointments</h3>
      <div className="time-slots">
        {schedule.map(slot => (
          <div key={slot._id} className={`time-slot ${slot.status}`}>
            <p>{slot.patientName}</p>
            <p>{slot.time}</p>
            <button>Start Consultation</button>
          </div>
        ))}
      </div>
    </div>
  );
};