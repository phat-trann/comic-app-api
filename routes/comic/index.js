const express = require('express');
const { createNewComic } = require('../../utils/database/comic');
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

router.post(
  '/add',
  validateTokenMiddleware,
  validateAdminMiddleware,
  (req, res) => {
    const data = req.body;
    createNewComic(data);
    res.send('Hi');
  }
);

module.exports = router;
