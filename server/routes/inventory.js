const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Inventory');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;