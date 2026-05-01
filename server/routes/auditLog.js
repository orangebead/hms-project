const router = require('express').Router();
const db = require('../db');

// Get all audit logs for patient updates
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, p.Name AS Patient_Name 
      FROM Audit_Log a
      LEFT JOIN Patients p ON a.Patient_ID = p.ID
      ORDER BY a.Update_Timestamp DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get audit logs for a specific patient
router.get('/:patientId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM Audit_Log 
      WHERE Patient_ID = ? 
      ORDER BY Update_Timestamp DESC
    `, [req.params.patientId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;