const express = require('express');
const {
  validateToken,
  generateTokenToCookie,
} = require('../utils/helpers/token');
const router = express.Router();
const _CONF = require('../utils/config');
const usersRouter = require('./users');
const adminRouter = require('./admin');
const comicRouter = require('./comic');
const chaptersRouter = require('./chapters');
const commentRouter = require('./comment');
const categoryRouter = require('./category');

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

router.use('/users', usersRouter);
router.use('/admin', adminRouter);
router.use('/comic', comicRouter);
router.use('/chapters', chaptersRouter);
router.use('/comment', commentRouter);
router.use('/category', categoryRouter);

module.exports = router;
