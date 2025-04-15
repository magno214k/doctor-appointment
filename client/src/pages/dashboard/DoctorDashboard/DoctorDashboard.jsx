import { useState } from 'react';
import { useAuth } from '../../../context/authContext';
import AppointmentSchedule from './components/AppointmentSchedule';
import PatientQueue from './components/PatientQueue';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="doctor-dashboard-container">
      <aside className="doctor-sidebar">
        <div className="doctor-profile">
          <h3>Dr. {user?.name}</h3>
          <span className="doctor-badge">DOCTOR</span>
          <p>{user?.specialization}</p>
        </div>
        <nav>
          <button 
            className={activeTab === 'schedule' ? 'active' : ''}
            onClick={() => setActiveTab('schedule')}
          >
            Today's Schedule
          </button>
          <button 
            className={activeTab === 'queue' ? 'active' : ''}
            onClick={() => setActiveTab('queue')}
          >
            Patient Queue
          </button>
        </nav>
      </aside>

      <main className="doctor-main-content">
        {activeTab === 'schedule' && <AppointmentSchedule />}
        {activeTab === 'queue' && <PatientQueue />}
      </main>
    </div>
  );
};