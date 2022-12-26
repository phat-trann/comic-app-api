const express = require('express');
const {
  validateToken,
  generateTokenToCookie,
} = require('../utils/helpers/token');
const router = express.Router();
const _CONF = require('../utils/config');

/* GET home page. */
router.get('/', (_req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/refreshToken', (req, res) => {
  const { refreshToken } = req.body;
  const tokenData = refreshToken
    ? validateToken(refreshToken, _CONF.SECRET_REFRESH)
    : null;

  if (tokenData) {
    const user = {
      id: tokenData.id,
      userName: tokenData.userName,
    };
    generateTokenToCookie(res, user);
    res.json({
      error: false,
    });
  } else {
    res.status(400).json({
      error: true,
      message: 'Invalid request',
    });
  }
});

module.exports = router;
