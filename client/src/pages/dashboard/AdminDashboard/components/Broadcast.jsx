import { useState } from 'react';
import { sendNotificationToAll } from '../../../api/admin';

const Broadcast = () => {
  const [message, setMessage] = useState('');

  const handleBroadcast = async () => {
    await sendNotificationToAll(message);
    setMessage('');
  };

  return (
    <div className="broadcast">
      <h3>Send System Notification</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter broadcast message..."
      />
      <button onClick={handleBroadcast}>Send to All Users</button>
    </div>
  );
};