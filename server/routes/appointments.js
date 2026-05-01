const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
        p.Name AS Patient_Name,
        CONCAT(s.First_Name, ' ', s.Last_Name) AS Doctor_Name
      FROM Appointments a
      JOIN Patients p ON a.Patient_ID = p.ID
      JOIN Staff s ON a.Staff_ID = s.Staff_ID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { patient_id, staff_id, date, time } = req.body;
  try {
    await db.query('CALL sp_Book_Appointment(?, ?, ?, ?)', [patient_id, staff_id, date, time]);
    res.json({ success: true });
  } catch (err) {
    // Clean up MySQL error messages
    if (err.message.includes('Doctor already has a patient at this time')) {
      res.status(400).json({ error: 'This doctor is already booked at that date and time.' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

router.put('/:id', async (req, res) => {
  const { Status } = req.body;
  try {
    await db.query('UPDATE Appointments SET Status=? WHERE ID=?', [Status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Appointments WHERE ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;