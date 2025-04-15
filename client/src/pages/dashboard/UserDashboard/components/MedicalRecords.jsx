import { useState } from 'react';
import { uploadMedicalRecord } from '../../../api/records';

const MedicalRecords = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    await uploadMedicalRecord(formData);
    setFiles([...files, { name: file.name, date: new Date().toLocaleDateString() }]);
  };

  return (
    <div className="medical-records">
      <h3>Your Medical Records</h3>
      <input type="file" onChange={handleUpload} accept=".pdf,.jpg,.png" />
      <div className="records-list">
        {files.map((file, index) => (
          <div key={index} className="record-item">
            <span>{file.name}</span>
            <span>{file.date}</span>
            <button>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};