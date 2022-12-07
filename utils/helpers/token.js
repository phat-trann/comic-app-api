const { sign, verify } = require('jsonwebtoken');
const _CONF = require('../config');
const { isAdmin } = require('../database/users');

const createToken = (user, secret, expiresIn) =>
  sign({ userName: user.userName, id: user.id }, secret, {
    expiresIn: expiresIn,
  });

const validateToken = (accessToken, secret) => {
  try {
    return verify(accessToken, secret);
  } catch (error) {
    return null;
  }
};

const generateTokenToCookie = (res, user) => {
  res.cookie('access-token', createToken(user, _CONF.SECRET, _CONF.tokenLife), {
    maxAge: _CONF.tokenLife * 1000,
    httpOnly: true,
  });
};

const generateTokens = (res, user) => {
  generateTokenToCookie(res, user);

  return {
    refreshToken: createToken(
      user,
      _CONF.SECRET_REFRESH,
      _CONF.refreshTokenLife
    ),
  };
};

const validateTokenMiddleware = (req, res, next) => {
  const accessToken = req.cookies['access-token'];

  try {
    const validToken = validateToken(accessToken, _CONF.SECRET);
    if (validToken) {
      req.id = validToken.id;
      req.userName = validToken.userName;

      return next();
    } else {
      return res.json({ error: true, message: 'User not Authenticated!' });
    }
  } catch (error) {
    return res.json({ error: true, message: error.message });
  }
};

const validateAdminMiddleware = async (req, res, next) => {
  const { id, userName } = req;

  if (await isAdmin({ id, userName })) return next();
  return res.json({
    error: true,
    message: "Current user don't have permission to do this action(s)",
  });
};

const removeToken = (res) => {
  res.clearCookie('access-token');
  res.end();
};

module.exports = {
  generateTokens,
  validateToken,
  validateTokenMiddleware,
  validateAdminMiddleware,
  generateTokenToCookie,
  removeToken,
};
