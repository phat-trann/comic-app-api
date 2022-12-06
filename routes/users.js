const express = require('express');
const router = express.Router();

const { verifyUser, createNewUser } = require('../utils/database/users');
const { generateTokens } = require('../utils/helpers/token');

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
    const { userName, firstName, lastName, email, password, age, gender } =
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

module.exports = router;
