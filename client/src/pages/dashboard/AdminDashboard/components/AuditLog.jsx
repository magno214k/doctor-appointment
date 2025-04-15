import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../../api/admin';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getAuditLogs();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <div className="audit-log">
      <h3>System Activity Log</h3>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.action}</td>
              <td>{log.userEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};