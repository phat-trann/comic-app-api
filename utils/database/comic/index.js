const comic = require('../../../models/comic');
const chapter = require('../../../models/chapter');

const getComic = async (comicHashName) => {
  return await comic.findOne({
    hashName: comicHashName,
  });
};

const getComicsCount = async () => {
  return await comic.countDocuments();
};

const getComics = async (data) => {
  const { skip, limit, sort, sortType, categoryIn, categoryEx, ...searchData } =
    data;

  if (searchData?.chaptersLength) {
    searchData.chaptersLength = { $gte: searchData.chaptersLength };
  }

  if (categoryIn) {
    searchData.category = {
      $all: categoryIn.split(','),
    };
  }

  if (categoryEx) {
    searchData.category = {
      ...searchData.category,
      $nin: categoryEx.split(','),
    };
  }

  return await comic
    .find({ ...searchData })
    .skip(skip)
    .limit(limit)
    .sort([[sort, sortType]]);
};

const getComicsByName = async (data) => {
  const { limit, name } = data;
  const search = {
    $or: [
      {
        name: new RegExp(name, 'i'),
      },
      {
        anotherName: new RegExp(name, 'i'),
      },
    ],
  };
  return await comic.find({ ...search }).limit(limit);
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
  getComicsByName,
  getComicsCount,
};
