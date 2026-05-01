const router = require('express').Router();
const db = require('../db');

// Get all patients with age calculated
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *, fn_Calculate_Age(DOB) AS Age 
      FROM Patients
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a patient
router.post('/', async (req, res) => {
  const { Name, DOB, Contact, Med_History } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Patients (Name, DOB, Contact, Med_History) VALUES (?, ?, ?, ?)',
      [Name, DOB, Contact, Med_History]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a patient (triggers audit log automatically)
router.put('/:id', async (req, res) => {
  const { Name, DOB, Contact, Med_History } = req.body;
  try {
    await db.query(
      'UPDATE Patients SET Name=?, DOB=?, Contact=?, Med_History=? WHERE ID=?',
      [Name, DOB, Contact, Med_History, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Patients WHERE ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;