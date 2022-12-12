const comic = require('../../../models/comic');

const createNewComic = async (currentData) => {
  try {
    const newComic = new comic(currentData);
    await newComic.save();

    return {
      newComic,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewComic,
};
