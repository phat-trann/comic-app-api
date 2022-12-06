const config = Object.freeze({
  SECRET: 'SECRET',
  SECRET_REFRESH: 'SECRET_REFRESH',
  tokenLife: 10 * 60,
  refreshTokenLife: 60 * 60 * 24,
});

module.exports = config;
