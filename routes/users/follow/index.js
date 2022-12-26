const express = require('express');
const {
  getComicsByListHashName,
  getComic,
  comicToggleFollow,
} = require('../../../utils/database/comic');
const {
  userToggleFollowComic,
  getUser,
} = require('../../../utils/database/users');
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
  const comicHashName = req.body?.hashName;
  const currentUser = await getUser({ userName: req?.userName });
  const currentComic = await getComic(comicHashName);

  if (currentUser && currentComic) {
    const isFollow = currentUser._doc.follows.indexOf(comicHashName) === -1;
    await userToggleFollowComic(currentUser, comicHashName, isFollow);

    const followsCount = await comicToggleFollow(
      currentComic,
      isFollow ? 1 : -1
    );

    return res.json({
      error: false,
      data: {
        followsCount,
        isFollow,
      },
    });
  }

  return res.status(404).json({
    error: true,
  });
});

module.exports = router;
