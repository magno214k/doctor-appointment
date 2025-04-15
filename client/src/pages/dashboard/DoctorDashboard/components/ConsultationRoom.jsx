import { useState, useEffect, useRef } from 'react';
import { Socket } from '../../../utils/socket';

const ConsultationRoom = ({ appointmentId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = Socket.connect(appointmentId);
    
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => Socket.disconnect();
  }, [appointmentId]);

  const sendMessage = () => {
    socketRef.current.emit('message', {
      text: newMessage,
      sender: 'doctor',
      timestamp: new Date()
    });
    setNewMessage('');
  };

  return (
    <div className="consultation-room">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};