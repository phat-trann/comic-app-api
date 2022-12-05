const express = require('express');
const router = express.Router();

const { createNewUser } = require('../utils/database/users');

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    const responseData = await createNewUser({
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      age: data.age,
      gender: data.gender,
    });

    if (responseData?.error) return res.json(responseData);

    return res.json({ error: false, ...responseData });
  } catch (error) {
    return res.json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

module.exports = router;
