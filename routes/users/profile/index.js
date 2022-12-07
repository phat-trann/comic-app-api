const express = require('express');
const router = express.Router();

const { validateTokenMiddleware } = require('../../../utils/helpers/token');

router.get('/', validateTokenMiddleware, (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
