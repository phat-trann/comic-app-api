const express = require('express');
const {
  validateTokenMiddleware,
  validateAdminMiddleware,
} = require('../../utils/helpers/token');
const router = express.Router();

router.get(
  '/',
  validateTokenMiddleware,
  validateAdminMiddleware,
  (req, res) => {
    res.send('Hi');
  }
);

module.exports = router;
