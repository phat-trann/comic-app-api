const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
} = require('../../../utils/database/profile');
const { validateTokenMiddleware } = require('../../../utils/helpers/token');
const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
  const { id, userName } = req;
  let userProfile;

  if (
    id &&
    userName &&
    (userProfile = await getUserProfile({ id, userName }))
  ) {
    return res.json({
      error: false,
      ...userProfile,
    });
  }
  return res.json({
    error: true,
  });
});

router.post('/edit', validateTokenMiddleware, async (req, res) => {
  const { id, userName } = req;

  if (!id || !userName)
    return res.json({
      error: true,
      message: 'User not Authenticated',
    });
  const { firstName, lastName, dob, gender, avatar } = req.body;
  const userProfile = await updateUserProfile({
    id,
    userName,
    firstName,
    lastName,
    dob,
    gender,
    avatar,
  });

  if (userProfile)
    return res.json({
      error: false,
      ...userProfile,
    });

  return res.json({
    error: true,
    message: 'Something wrongs!',
  });
});

module.exports = router;
