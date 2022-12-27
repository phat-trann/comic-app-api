const express = require('express');
const router = express.Router();
const { createNewCategory } = require('../../utils/database/category');
const {
  validateAdminMiddleware,
  validateTokenMiddleware,
} = require('../../utils/helpers/token');

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

module.exports = router;
