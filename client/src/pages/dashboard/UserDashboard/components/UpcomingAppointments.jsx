import { useEffect, useState } from 'react';
import { getUserAppointments } from '../../../api/appointments';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getUserAppointments();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="appointments-list">
      <h3>Upcoming Appointments</h3>
      {appointments.map(app => (
        <div key={app._id} className="appointment-card">
          <p>Dr. {app.doctorName}</p>
          <p>{new Date(app.date).toLocaleString()}</p>
          <span className={`status ${app.status}`}>{app.status}</span>
        </div>
      ))}
    </div>
  );
};