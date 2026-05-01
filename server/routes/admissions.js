const router = require('express').Router();
const db = require('../db');

// Get all admissions (Uses Stored Function for length of stay)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, p.Name AS Patient_Name, r.Room_Type, 
             fn_Length_Of_Stay(a.Admit_Date, a.Discharge_Date) AS Days_Admitted
      FROM Admissions a
      JOIN Patients p ON a.Patient_ID = p.ID
      JOIN Rooms r ON a.Room_ID = r.Room_ID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active admissions only (Uses the v_active_admissions View)
router.get('/active', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_active_admissions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admit a patient (Uses Stored Procedure)
router.post('/', async (req, res) => {
  const { Patient_ID, Room_ID } = req.body;
  try {
    await db.query('CALL sp_Admit_Patient(?, ?)', [Patient_ID, Room_ID]);
    res.json({ success: true, message: 'Patient admitted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Discharge a patient & auto-bill (Uses Stored Procedure)
router.put('/:id/discharge', async (req, res) => {
  try {
    await db.query('CALL sp_Discharge_Patient_And_Bill(?)', [req.params.id]);
    res.json({ success: true, message: 'Patient discharged and billed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an admission
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Admissions WHERE ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;