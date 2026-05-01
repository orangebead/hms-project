import { useEffect, useState } from 'react';
import BASE_URL from '../api';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ Name: '', DOB: '', Contact: '', Med_History: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchPatients = () => {
    fetch(`${BASE_URL}/api/patients`)
      .then(res => res.json())
      .then(data => setPatients(data));
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async () => {
    const url = editingId
      ? `${BASE_URL}/api/patients/${editingId}`
      : `${BASE_URL}/api/patients`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
    } else {
      setShowForm(false);
      setEditingId(null);
      setForm({ Name: '', DOB: '', Contact: '', Med_History: '' });
      fetchPatients();
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.ID);
    setForm({
      Name: p.Name,
      DOB: p.DOB?.split('T')[0],
      Contact: p.Contact,
      Med_History: p.Med_History,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient?')) return;
    const res = await fetch(`${BASE_URL}/api/patients/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchPatients();
    else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ Name: '', DOB: '', Contact: '', Med_History: '' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Patient
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            value={form.Name}
            onChange={e => setForm({ ...form, Name: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="date"
            value={form.DOB}
            onChange={e => setForm({ ...form, DOB: e.target.value })}
            className="border rounded p-2"
          />
          <input
            placeholder="Contact"
            value={form.Contact}
            onChange={e => setForm({ ...form, Contact: e.target.value })}
            className="border rounded p-2"
          />
          <input
            placeholder="Medical History"
            value={form.Med_History}
            onChange={e => setForm({ ...form, Med_History: e.target.value })}
            className="border rounded p-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 col-span-2"
          >
            {editingId ? 'Update Patient' : 'Save Patient'}
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">ID</th>
            <th className="p-3 text-left border">Name</th>
            <th className="p-3 text-left border">Age</th>
            <th className="p-3 text-left border">Contact</th>
            <th className="p-3 text-left border">Medical History</th>
            <th className="p-3 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.ID} className="hover:bg-gray-50">
              <td className="p-3 border">{p.ID}</td>
              <td className="p-3 border">{p.Name}</td>
              <td className="p-3 border">{p.Age}</td>
              <td className="p-3 border">{p.Contact}</td>
              <td className="p-3 border">{p.Med_History}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.ID)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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