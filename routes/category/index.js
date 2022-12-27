const express = require('express');
const router = express.Router();
const {
  createNewCategory,
  getCategory,
} = require('../../utils/database/category');
const { getComic } = require('../../utils/database/comic');
const {
  validateAdminMiddleware,
  validateTokenMiddleware,
} = require('../../utils/helpers/token');

router.post(
  '/add',
  validateTokenMiddleware,
  validateAdminMiddleware,
  async (req, res) => {
    try {
      const { name } = req.body;
      const responseData = await createNewCategory({ name });

      if (responseData?.error) return res.status(400).json(responseData);

      return res.json({
        error: false,
        data: responseData,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  }
);

router.post(
  '/assign',
  validateTokenMiddleware,
  validateAdminMiddleware,
  async (req, res) => {
    try {
      const { comicHashName, categoryKey } = req.body;
      const currentComic = await getComic(comicHashName);
      const currentCategory = await getCategory({ id: categoryKey });

      /* TODO: Admin page */
      // const data = await assignCategory()

      return res.json({
        error: false,
        data: currentComic,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message || 'Something wrong!',
      });
    }
  }
);

module.exports = router;
