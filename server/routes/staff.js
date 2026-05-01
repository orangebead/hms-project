const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.Department_Name 
      FROM Staff s
      LEFT JOIN Departments d ON s.Department_ID = d.Department_ID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;