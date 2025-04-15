// src/components/NotificationCenter.jsx
import { useEffect, useState } from 'react';
import { Socket } from '../utils/socket';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = Socket.getSocket();
    
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => socket.off('notification');
  }, []);

  return (
    <div className="notification-center">
      {notifications.map((notif, i) => (
        <div key={i} className={`notification ${notif.type}`}>
          <p>{notif.message}</p>
          <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};