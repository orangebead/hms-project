import { useEffect, useState } from 'react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');

  const fetchLogs = (patientId = '') => {
    const url = patientId
      ? `http://127.0.0.1:3001/api/audit-log/${patientId}`
      : 'http://127.0.0.1:3001/api/audit-log';
    fetch(url).then(res => res.json()).then(setLogs);
  };

  useEffect(() => {
    fetchLogs();
    fetch('http://127.0.0.1:3001/api/patients')
      .then(res => res.json()).then(setPatients);
  }, []);

  const handleFilter = (e) => {
    setSelectedPatient(e.target.value);
    fetchLogs(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-gray-500 text-sm mt-1">Recovery log — before/after values for all patient record changes</p>
        </div>
        <select
          value={selectedPatient}
          onChange={handleFilter}
          className="border rounded p-2"
        >
          <option value="">All Patients</option>
          {patients.map(p => (
            <option key={p.ID} value={p.ID}>{p.Name}</option>
          ))}
        </select>
      </div>

      {logs.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No audit entries yet.</p>
          <p className="text-sm mt-1">Edit a patient record to generate an entry.</p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Log ID</th>
              <th className="p-3 text-left border">Patient</th>
              <th className="p-3 text-left border">Old Contact</th>
              <th className="p-3 text-left border">Old Medical History</th>
              <th className="p-3 text-left border">Changed At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.Log_ID} className="hover:bg-gray-50">
                <td className="p-3 border">{log.Log_ID}</td>
                <td className="p-3 border">{log.Patient_Name}</td>
                <td className="p-3 border">{log.Old_Contact || '—'}</td>
                <td className="p-3 border">{log.Old_History || '—'}</td>
                <td className="p-3 border">{new Date(log.Update_Timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}