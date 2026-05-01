import { useEffect, useState } from 'react';
import BASE_URL from '../api';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ Patient_ID: '', Staff_ID: '', Inventory_ID: '', Quantity: '', Presc_Date: '' });

  const fetchAll = () => {
    fetch(`${BASE_URL}/api/prescriptions`)
      .then(res => res.json()).then(setPrescriptions);
    fetch(`${BASE_URL}/api/patients`)
      .then(res => res.json()).then(setPatients);
    fetch(`${BASE_URL}/api/staff`)
      .then(res => res.json()).then(setStaff);
    fetch(`${BASE_URL}/api/inventory`)
      .then(res => res.json()).then(setInventory);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    const res = await fetch(`${BASE_URL}/api/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else {
      setShowForm(false);
      setForm({ Patient_ID: '', Staff_ID: '', Inventory_ID: '', Quantity: '', Presc_Date: '' });
      fetchAll();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this prescription?')) return;
    await fetch(`${BASE_URL}/api/prescriptions/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Prescription
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
            value={form.Staff_ID}
            onChange={e => setForm({ ...form, Staff_ID: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Doctor</option>
            {staff.map(s => (
              <option key={s.Staff_ID} value={s.Staff_ID}>
                {s.First_Name} {s.Last_Name} — {s.Role}
              </option>
            ))}
          </select>

          <select
            value={form.Inventory_ID}
            onChange={e => setForm({ ...form, Inventory_ID: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Select Medicine</option>
            {inventory.map(i => (
              <option key={i.ID} value={i.ID}>
                {i.Name} — ${i.Unit_Price} (Stock: {i.Quantity})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={form.Quantity}
            onChange={e => setForm({ ...form, Quantity: e.target.value })}
            className="border rounded p-2"
          />

          <input
            type="date"
            value={form.Presc_Date}
            onChange={e => setForm({ ...form, Presc_Date: e.target.value })}
            className="border rounded p-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 col-span-2"
          >
            Save Prescription
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">ID</th>
            <th className="p-3 text-left border">Patient</th>
            <th className="p-3 text-left border">Doctor</th>
            <th className="p-3 text-left border">Medicine</th>
            <th className="p-3 text-left border">Quantity</th>
            <th className="p-3 text-left border">Date</th>
            <th className="p-3 text-left border">Cost</th>
            <th className="p-3 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(p => (
            <tr key={p.ID} className="hover:bg-gray-50">
              <td className="p-3 border">{p.ID}</td>
              <td className="p-3 border">{p.Patient_Name}</td>
              <td className="p-3 border">{p.Doctor_Name}</td>
              <td className="p-3 border">{p.Medicine_Name}</td>
              <td className="p-3 border">{p.Quantity}</td>
              <td className="p-3 border">{p.Presc_Date?.split('T')[0]}</td>
              <td className="p-3 border">${p.Cost}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleDelete(p.ID)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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