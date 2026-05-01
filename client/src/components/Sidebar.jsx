import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '🏥 Dashboard' },
  { to: '/patients', label: '👤 Patients' },
  { to: '/appointments', label: '📅 Appointments' },
  { to: '/admissions', label: '🛏 Admissions' },
  { to: '/prescriptions', label: '💊 Prescriptions' },
  { to: '/audit-log', label: '📋 Audit Log' },
];

export default function Sidebar() {
  return (
    <div className="w-56 min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8 text-blue-400">HMS</h1>
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}