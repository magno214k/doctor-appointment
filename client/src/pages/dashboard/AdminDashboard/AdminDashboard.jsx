import { useState } from 'react';
import { useAuth } from '../../../context/authContext';
import StatsOverview from './components/StatsOverview';
import RecentAppointments from './components/RecentAppointments';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-profile">
          <h3>{user?.name}</h3>
          <span className="admin-badge">ADMIN</span>
        </div>
        <nav>
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'appointments' ? 'active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          {/* Add more tabs as needed */}
        </nav>
      </aside>

      <main className="admin-main-content">
        {activeTab === 'overview' && (
          <>
            <StatsOverview />
            <RecentAppointments />
          </>
        )}
        {activeTab === 'appointments' && (
          <div>Appointments Management</div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;