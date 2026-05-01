const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.*, 
        p.Name AS Patient_Name,
        CONCAT(s.First_Name, ' ', s.Last_Name) AS Doctor_Name,
        i.Name AS Medicine_Name,
        fn_Calculate_Medication_Cost(pr.ID) AS Cost
      FROM Prescriptions pr
      JOIN Patients p ON pr.Patient_ID = p.ID
      JOIN Staff s ON pr.Staff_ID = s.Staff_ID
      JOIN Inventory i ON pr.Inventory_ID = i.ID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { Patient_ID, Staff_ID, Inventory_ID, Quantity, Presc_Date } = req.body;
  try {
    await db.query(
      'INSERT INTO Prescriptions (Patient_ID, Staff_ID, Inventory_ID, Quantity, Presc_Date) VALUES (?, ?, ?, ?, ?)',
      [Patient_ID, Staff_ID, Inventory_ID, Quantity, Presc_Date]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Prescriptions WHERE ID=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;