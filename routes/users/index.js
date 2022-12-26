const express = require('express');
const router = express.Router();
const profileRouter = require('./profile');

const { verifyUser, createNewUser } = require('../../utils/database/users');
const { generateTokens, removeToken } = require('../../utils/helpers/token');

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const responseData = await verifyUser({
      userName,
      password,
    });

    if (responseData?.error) return res.json(responseData);

    const tokenGenerated = generateTokens(res, responseData);

    return res.json({
      error: false,
      ...responseData,
      ...tokenGenerated,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password, dob, gender } =
      req.body;
    const responseData = await createNewUser({
      userName,
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
    });

    if (responseData?.error) return res.json(responseData);

    const tokenGenerated = generateTokens(res, responseData);

    return res.json({
      error: false,
      ...responseData,
      ...tokenGenerated,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.delete('/logout', (req, res) => {
  try {
    removeToken(res);

    return res.json({
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.use('/profile', profileRouter);

module.exports = router;
