import { useState } from 'react';
import { useAuth } from '../../../context/authContext';
import UpcomingAppointments from './components/UpcomingAppointments';
import MedicalHistory from './components/MedicalHistory';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  return (
    <div className="user-dashboard-container">
      <aside className="user-sidebar">
        <div className="user-profile">
          <h3>{user?.name}</h3>
          <span className="user-badge">PATIENT</span>
        </div>
        <nav>
          <button 
            className={activeTab === 'appointments' ? 'active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            My Appointments
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Medical History
          </button>
        </nav>
      </aside>

      <main className="user-main-content">
        {activeTab === 'appointments' && <UpcomingAppointments />}
        {activeTab === 'history' && <MedicalHistory />}
      </main>
    </div>
  );
};