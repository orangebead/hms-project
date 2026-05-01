import { useEffect, useState } from 'react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id: '', staff_id: '', date: '', time: '' });

  const fetchAll = () => {
    fetch('http://127.0.0.1:3001/api/appointments')
      .then(res => res.json()).then(setAppointments);
    fetch('http://127.0.0.1:3001/api/patients')
      .then(res => res.json()).then(setPatients);
    fetch('http://127.0.0.1:3001/api/staff')
      .then(res => res.json()).then(setStaff);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    const res = await fetch('http://127.0.0.1:3001/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else {
      setShowForm(false);
      setForm({ patient_id: '', staff_id: '', date: '', time: '' });
      fetchAll();
    }
  };

  const handleStatus = async (id, status) => {
    await fetch(`http://127.0.0.1:3001/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Status: status }),
    });
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    await fetch(`http://127.0.0.1:3001/api/appointments/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const statusColor = (status) => {
    if (status === 'Scheduled') return 'bg-blue-100 text-blue-700';
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
          <select
            value={form.patient_id}
            onChange={e => setForm({ ...form, patient_id: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.ID} value={p.ID}>{p.Name}</option>
            ))}
          </select>

          <select
            value={form.staff_id}
            onChange={e => setForm({ ...form, staff_id: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Doctor</option>
            {staff.map(s => (
              <option key={s.Staff_ID} value={s.Staff_ID}>
                {s.First_Name} {s.Last_Name} — {s.Role}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            className="border rounded p-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 col-span-2"
          >
            Book
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">ID</th>
            <th className="p-3 text-left border">Patient</th>
            <th className="p-3 text-left border">Doctor</th>
            <th className="p-3 text-left border">Date</th>
            <th className="p-3 text-left border">Time</th>
            <th className="p-3 text-left border">Status</th>
            <th className="p-3 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.ID} className="hover:bg-gray-50">
              <td className="p-3 border">{a.ID}</td>
              <td className="p-3 border">{a.Patient_Name}</td>
              <td className="p-3 border">{a.Doctor_Name}</td>
              <td className="p-3 border">{a.Appt_Date?.split('T')[0]}</td>
              <td className="p-3 border">{a.Appt_Time}</td>
              <td className="p-3 border">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor(a.Status)}`}>
                  {a.Status}
                </span>
              </td>
              <td className="p-3 border flex gap-2">
                <button
                  onClick={() => handleStatus(a.ID, 'Completed')}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleStatus(a.ID, 'Cancelled')}
                  className="bg-yellow-400 text-white px-2 py-1 rounded text-sm hover:bg-yellow-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(a.ID)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}