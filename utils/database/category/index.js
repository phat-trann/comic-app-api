const category = require('../../../models/category');

const getComicsInCategoryCount = async (id) => {
  const currentCategory = await category.findOne({ key: id });

  console.log(currentCategory);

  if (currentCategory) return currentCategory?.assign?.length || null;
  return null;
};

module.exports = { getComicsInCategoryCount };
