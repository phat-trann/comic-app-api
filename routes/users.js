const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  const data = req.body;
  res.json(data);
});

module.exports = router;
