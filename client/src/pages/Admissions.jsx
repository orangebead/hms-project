import { useEffect, useState } from 'react';

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ Patient_ID: '', Room_ID: '' });

  const fetchAll = () => {
    fetch('http://127.0.0.1:3001/api/admissions')
      .then(res => res.json()).then(setAdmissions);
    fetch('http://127.0.0.1:3001/api/patients')
      .then(res => res.json()).then(setPatients);
    fetch('http://127.0.0.1:3001/api/rooms')
      .then(res => res.json()).then(setRooms);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdmit = async () => {
    const res = await fetch('http://127.0.0.1:3001/api/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else {
      setShowForm(false);
      setForm({ Patient_ID: '', Room_ID: '' });
      fetchAll();
    }
  };

  const handleDischarge = async (id) => {
    if (!confirm('Discharge this patient and generate bill?')) return;
    const res = await fetch(`http://127.0.0.1:3001/api/admissions/${id}/discharge`, {
      method: 'PUT',
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else fetchAll();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admissions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Admit Patient
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
          <select
            value={form.Patient_ID}
            onChange={e => setForm({ ...form, Patient_ID: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.ID} value={p.ID}>{p.Name}</option>
            ))}
          </select>

          <select
            value={form.Room_ID}
            onChange={e => setForm({ ...form, Room_ID: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Room</option>
            {rooms.filter(r => r.Status === 'Available').map(r => (
              <option key={r.Room_ID} value={r.Room_ID}>
                Room {r.Room_ID} — {r.Room_Type} ({r.Department_Name})
              </option>
            ))}
          </select>

          <button
            onClick={handleAdmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 col-span-2"
          >
            Admit Patient
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">ID</th>
            <th className="p-3 text-left border">Patient</th>
            <th className="p-3 text-left border">Room</th>
            <th className="p-3 text-left border">Admit Date</th>
            <th className="p-3 text-left border">Discharge Date</th>
            <th className="p-3 text-left border">Days</th>
            <th className="p-3 text-left border">Status</th>
            <th className="p-3 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map(a => (
            <tr key={a.ID} className="hover:bg-gray-50">
              <td className="p-3 border">{a.ID}</td>
              <td className="p-3 border">{a.Patient_Name}</td>
              <td className="p-3 border">{a.Room_Type}</td>
              <td className="p-3 border">{a.Admit_Date?.split('T')[0]}</td>
              <td className="p-3 border">{a.Discharge_Date?.split('T')[0] || '—'}</td>
              <td className="p-3 border">{a.Days_Admitted}</td>
              <td className="p-3 border">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  a.Discharge_Date ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                }`}>
                  {a.Discharge_Date ? 'Discharged' : 'Active'}
                </span>
              </td>
              <td className="p-3 border">
                {!a.Discharge_Date && (
                  <button
                    onClick={() => handleDischarge(a.ID)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Discharge & Bill
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}