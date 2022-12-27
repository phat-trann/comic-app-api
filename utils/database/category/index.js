const category = require('../../../models/category');

const getCategory = async ({ id }) => await category.findOne({ key: id });

const getComicsInCategoryCount = async (id) => {
  const currentCategory = getCategory({ id });
  if (currentCategory) return currentCategory?.assign?.length || null;
  return null;
};

const createNewCategory = async ({ name }) => {
  try {
    const hashName = name.trim().split(' ').join('-').toLowerCase();
    if (await getCategory({ id: hashName }))
      return {
        error: true,
        message: 'Category already exists',
      };

    const newCategory = new category({
      key: hashName,
      name,
      assign: [],
    });

    await newCategory.save();

    return newCategory;
  } catch (error) {
    return {
      error: true,
      message: error?.message,
    };
  }
};

module.exports = { getComicsInCategoryCount, createNewCategory };
