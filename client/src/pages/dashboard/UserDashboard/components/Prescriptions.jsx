import { useEffect, useState } from 'react';
import { getPrescriptions } from '../../../api/prescriptions';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPrescriptions();
      setPrescriptions(data);
    };
    fetchData();
  }, []);

  return (
    <div className="prescriptions">
      {prescriptions.map(pres => (
        <div key={pres._id} className="prescription-card">
          <h4>{pres.medication}</h4>
          <p>Dr. {pres.doctorName}</p>
          <p>{new Date(pres.date).toLocaleDateString()}</p>
          <button onClick={() => window.print(pres._id)}>Print</button>
        </div>
      ))}
    </div>
  );
};