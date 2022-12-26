const express = require('express');
const { createNewComment, getComments } = require('../../utils/database/comment');
const { getUser, userReceivedExp } = require('../../utils/database/users');
const {
  getUserDataMiddleware,
  validateTokenMiddleware,
} = require('../../utils/helpers/token');
const router = express.Router();

router.get('/', getUserDataMiddleware, async (req, res) => {
  try {
    const { comicHashName, chapterHashName, current = 0 } = req.params;
    const comments = await getComments({
      comicHashName,
      chapterHashName,
      current,
    });

    return res.json({
      error: false,
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

router.post('/', validateTokenMiddleware, async (req, res) => {
  try {
    const currentUser = await getUser({ userName: req?.userName });
    const { comicHashName, chapterHashName, parentId, message } = req.body;
    const newComment = await createNewComment({
      author: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        userName: currentUser.userName,
        id: currentUser.id,
        avatar: currentUser.avatar || '',
      },
      comicHashName,
      chapterHashName,
      message,
      parentId,
    });
    await userReceivedExp(currentUser, 'COMMENT');

    return res.json({
      error: false,
      data: newComment,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message || 'Something wrong!',
    });
  }
});

module.exports = router;
