const express = require('express');
const {
  validateToken,
  generateTokenToCookie,
} = require('../utils/helpers/token');
const router = express.Router();
const _CONF = require('../utils/config');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./comic-app.yaml');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

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
