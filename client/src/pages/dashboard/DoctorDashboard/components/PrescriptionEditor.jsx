import { useState } from 'react';
import { createPrescription } from '../../../api/prescriptions';

const PrescriptionEditor = ({ patientId }) => {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    instructions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPrescription({ ...formData, patientId });
    setFormData({ medication: '', dosage: '', instructions: '' });
  };

  return (
    <div className="prescription-editor">
      <h3>Create New Prescription</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Medication"
          value={formData.medication}
          onChange={(e) => setFormData({...formData, medication: e.target.value})}
          required
        />
        <input
          placeholder="Dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          required
        />
        <textarea
          placeholder="Instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          required
        />
        <button type="submit">Save Prescription</button>
      </form>
    </div>
  );
};