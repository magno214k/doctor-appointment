import { useEffect, useState } from 'react';
import { getAdminStats } from '../../../api/admin';

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Total Users</h4>
        <p>{stats.totalUsers}</p>
      </div>
      <div className="stat-card">
        <h4>Verified Doctors</h4>
        <p>{stats.totalDoctors}</p>
      </div>
      <div className="stat-card">
        <h4>Pending Appointments</h4>
        <p>{stats.pendingAppointments}</p>
      </div>
    </div>
  );
};