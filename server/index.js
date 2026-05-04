const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://hms-project-2026.vercel.app/']
}));
app.use(express.json());

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/audit-log', require('./routes/auditLog'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/inventory', require('./routes/inventory'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));