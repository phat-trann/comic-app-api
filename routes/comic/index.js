const express = require('express');
const {
  createNewComic,
  getComic,
  getChapter,
  getComics,
  getComicsCount,
} = require('../../utils/database/comic');
const {
  validateTokenMiddleware,
  validateAdminMiddleware,
} = require('../../utils/helpers/token');
const router = express.Router();

router.get('/search', async (req, res) => {
  const searchData = req.query;
  const comics = await getComics(searchData);

  if (!comics?.length) {
    return res.status(404).json({
      error: true,
      message: 'Not found',
    });
  }

  return res.json({
    error: false,
    data: comics,
  });
});

router.get('/count', async (req, res) => {
  const count = await getComicsCount();

  return res.json({
    error: false,
    data: count,
  });
});

router.get('/:hashName', async (req, res) => {
  const hashName = req.params.hashName;
  const currentComic = await getComic(hashName);

  if (!currentComic)
    return res.status(404).json({
      error: true,
      message: 'Not found',
    });

  return res.json({
    error: false,
    data: currentComic?._doc,
  });
});

router.get('/:hashName/:chapter', async (req, res) => {
  const { hashName, chapter } = req.params;
  const currentChapter = await getChapter(hashName, chapter);

  if (!currentChapter)
    return res.status(404).json({
      error: true,
      message: 'Not found',
    });

  return res.json({
    error: false,
    data: currentChapter?._doc,
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
