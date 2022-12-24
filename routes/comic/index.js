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
} = require('../../utils/database/comic');
const {
  validateTokenMiddleware,
  validateAdminMiddleware,
} = require('../../utils/helpers/token');
const router = express.Router();

router.get('/count', async (req, res) => {
  const { categoryId, ...queryData } = req.query;
  let count;

  if (categoryId) count = await getComicsInCategoryCount(categoryId);
  else if (Object.keys(queryData).length > 0) count = await getComicsCount(queryData);
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
      message: 'Not found',
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
      message: 'Not found',
    });
  }

  return res.json({
    error: false,
    data: comics,
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
