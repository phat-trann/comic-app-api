const express = require('express');
const { getComicsInCategoryCount } = require('../../utils/database/category');
const {
  createNewComic,
  getComic,
  getChapter,
  getComics,
  getComicsCount,
  getFullComicsCount,
  getComicsByName,
  comicToggleLike,
  voteComic,
} = require('../../utils/database/comic');
const {
  getUser,
  userToggleLikeComic,
  userVoteComic,
} = require('../../utils/database/users');
const {
  validateTokenMiddleware,
  validateAdminMiddleware,
} = require('../../utils/helpers/token');
const router = express.Router();

router.get('/count', async (req, res) => {
  const { categoryId, ...queryData } = req.query;
  let count;

  if (categoryId) count = await getComicsInCategoryCount(categoryId);
  else if (Object.keys(queryData).length > 0)
    count = await getComicsCount(queryData);
  else count = await getFullComicsCount();

  if (typeof count !== 'number')
    return res.json({
      error: true,
    });

  return res.json({
    error: false,
    data: count,
  });
});

router.get('/search', async (req, res) => {
  const searchData = req.query;
  const comics = await getComics(searchData);

  if (!comics?.length) {
    return res.status(404).json({
      error: true,
    });
  }

  return res.json({
    error: false,
    data: comics,
  });
});

router.get('/searchByName', async (req, res) => {
  const searchData = req.query;
  const comics = await getComicsByName(searchData);

  if (!comics?.length) {
    return res.status(404).json({
      error: true,
    });
  }

  return res.json({
    error: false,
    data: comics,
  });
});

router.get('/get/:hashName', async (req, res) => {
  const hashName = req.params.hashName;
  const currentComic = await getComic(hashName);

  if (!currentComic)
    return res.status(404).json({
      error: true,
    });

  return res.json({
    error: false,
    data: currentComic?._doc,
  });
});

router.post('/like', validateTokenMiddleware, async (req, res) => {
  const comicHashName = req.body?.hashName;
  const currentUser = await getUser({ userName: req?.userName });
  const currentComic = await getComic(comicHashName);

  if (currentUser && currentComic) {
    const isLike = currentUser._doc.likes.indexOf(comicHashName) === -1;
    await userToggleLikeComic(currentUser, comicHashName, isLike);

    const likesCount = await comicToggleLike(currentComic, isLike ? 1 : -1);

    return res.json({
      error: false,
      data: {
        likesCount,
        isLike,
      },
    });
  }

  return res.status(404).json({
    error: true,
  });
});

router.post('/vote', validateTokenMiddleware, async (req, res) => {
  const comicHashName = req.body?.hashName;
  const currentUser = await getUser({ userName: req?.userName });
  const currentComic = await getComic(comicHashName);
  const rateNumber = req.body?.vote;

  if (
    !!currentUser &&
    !!currentComic &&
    [1, 2, 3, 4, 5].indexOf(Number(rateNumber)) !== -1
  ) {
    const hasVoted = currentUser._doc.votes.indexOf(comicHashName) !== -1;

    if (hasVoted)
      return res.status(400).json({
        error: true,
        code: 1,
      });

    await userVoteComic(currentUser, comicHashName);
    const { voteCount, voteSum } = await voteComic(
      currentComic,
      Number(rateNumber)
    );

    return res.json({
      error: false,
      data: {
        voteCount,
        voteSum,
      },
    });
  }

  return res.status(400).json({
    error: true,
    code: 0,
  });
});

router.post(
  '/add',
  validateTokenMiddleware,
  validateAdminMiddleware,
  (req, res) => {
    const data = req.body;
    // createNewComic(data);
    res.send('Hi');
  }
);

module.exports = router;
