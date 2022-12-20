const comic = require('../../../models/comic');
const chapter = require('../../../models/chapter');

const getComic = async (comicHashName) => {
  return await comic.findOne({
    hashName: comicHashName,
  });
};

const getComics = async (data) => {
  const { skip, limit, sort, sortType, ...searchData } = data;
  return await comic
    .find({ ...searchData })
    .skip(skip)
    .limit(limit)
    .sort([[sort, sortType]]);
};

const getChapter = async (comicHashName, chapterId) => {
  return await chapter.findOne({
    hashName: [comicHashName, chapterId].join('/'),
  });
};

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
  getComic,
  getChapter,
  getComics,
};
