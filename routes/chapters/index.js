const express = require('express');
const {
  getChapter,
  chapterReceivedView,
} = require('../../utils/database/chapter');
const { getComic, comicReceivedView } = require('../../utils/database/comic');
const {
  getUser,
  userReceivedExp,
  userSaveHistory,
} = require('../../utils/database/users');
const { getUserDateMiddleware } = require('../../utils/helpers/token');
const router = express.Router();

router.get(
  '/get/:hashName/:chapter',
  getUserDateMiddleware,
  async (req, res) => {
    const { hashName, chapter } = req.params;
    const currentUser = await getUser({ userName: req?.userName });
    const currentChapter = await getChapter(hashName, chapter);
    const currentComic = await getComic(hashName);

    if (!currentChapter || !currentComic)
      return res.status(404).json({
        error: true,
      });

    if (currentUser) {
      await userReceivedExp(currentUser);
      await userSaveHistory(currentUser, hashName, chapter);
    }

    await chapterReceivedView(currentChapter);
    await comicReceivedView(currentComic);

    return res.json({
      error: false,
      data: currentChapter?._doc,
    });
  }
);

module.exports = router;
