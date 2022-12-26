const express = require('express');
const router = express.Router();
const profileRouter = require('./profile');
const followRouter = require('./follow');

const {
  verifyUser,
  createNewUser,
  getUser,
} = require('../../utils/database/users');
const {
  generateTokens,
  removeToken,
  validateTokenMiddleware,
} = require('../../utils/helpers/token');
const { getComicsByListHashName } = require('../../utils/database/comic');

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

    if (responseData?.error) return res.status(400).json(responseData);

    const tokenGenerated = generateTokens(res, responseData);

    return res.json({
      error: false,
      ...responseData,
      ...tokenGenerated,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      avatar,
    } = req.body;
    const responseData = await createNewUser({
      userName,
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      avatar,
    });

    if (responseData?.error) return res.json(responseData);

    const tokenGenerated = generateTokens(res, responseData);

    return res.json({
      error: false,
      ...responseData,
      ...tokenGenerated,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.get('/history', validateTokenMiddleware, async (req, res) => {
  const currentUser = await getUser({ userName: req?.userName });

  if (!currentUser)
    return res.status(400).json({
      error: true,
    });

  const history = currentUser._doc.history || [];
  const comicHashNames = history.map((chapter) => chapter.split('/')[0]);
  const comics = await getComicsByListHashName(comicHashNames);
  const data = comicHashNames.map((hashName, index) => {
    const comic = comics.find((el) => el.hashName === hashName);

    return {
      ...comic._doc,
      lastChapter: history[index],
    };
  });

  return res.json({
    error: false,
    data: data || [],
  });
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
router.use('/follow', followRouter);

module.exports = router;
