const express = require('express');
const { getComicsByListHashName } = require('../../../utils/database/comic');
const {
  updateUserProfile,
} = require('../../../utils/database/profile');
const { getUser } = require('../../../utils/database/users');
const { validateTokenMiddleware } = require('../../../utils/helpers/token');
const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
  const currentUser = await getUser({ userName: req?.userName });

  if (!currentUser)
    return res.status(400).json({
      error: true,
    });

  return res.json({
    error: false,
    data: (await getComicsByListHashName(currentUser._doc.follows || [])) || [],
  });
});

router.post('/', validateTokenMiddleware, async (req, res) => {
  const { id, userName } = req;
});

router.delete('/', validateTokenMiddleware, async (req, res) => {
  const { id, userName } = req;
});

module.exports = router;
