const comic = require('../../../models/comic');

const getComic = async (comicHashName) => {
  return await comic.findOne({
    hashName: comicHashName,
  });
};

const getFullComicsCount = async () => {
  return await comic.countDocuments();
};

const getComicsCount = async (data) => {
  const { categoryIn, categoryEx, chaptersLength, ...searchData } = data;

  if (chaptersLength) {
    searchData.chaptersLength = { $gte: chaptersLength };
  }

  if (categoryIn) {
    searchData['category.key'] = {
      $all: categoryIn.split(','),
    };
  }

  if (categoryEx) {
    searchData['category.key'] = {
      ...searchData['category.key'],
      $nin: categoryEx.split(','),
    };
  }

  return await comic.count({ ...searchData });
};

const getComics = async (data) => {
  const {
    skip,
    limit,
    sort,
    sortType,
    categoryIn,
    categoryEx,
    chaptersLength,
    ...searchData
  } = data;

  if (chaptersLength) {
    searchData.chaptersLength = { $gte: chaptersLength };
  }

  if (categoryIn) {
    searchData['category.key'] = {
      $all: categoryIn.split(','),
    };
  }

  if (categoryEx) {
    searchData['category.key'] = {
      ...searchData['category.key'],
      $nin: categoryEx.split(','),
    };
  }

  return await comic
    .find({ ...searchData })
    .skip(skip)
    .limit(limit)
    .select('-chapters')
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

const comicToggleLike = async (currentComic, number) => {
  const newLikes = currentComic._doc.likes + number;

  currentComic.likes = newLikes;
  await currentComic.save();

  return newLikes;
};

const comicToggleFollow = async (currentComic, number) => {
  const newFollows = currentComic._doc.followers + number;

  currentComic.followers = newFollows;
  await currentComic.save();

  return newFollows;
};

const voteComic = async (currentComic, number) => {
  const newCount = currentComic._doc.voteCount + 1;
  const newSum = currentComic._doc.voteSum + number;

  currentComic.voteCount = newCount;
  currentComic.voteSum = newSum;
  await currentComic.save();

  return {
    voteCount: newCount,
    voteSum: newSum,
  };
};

const comicReceivedView = async (currentComic) => {
  currentComic.views = currentComic._doc.views + 1;
  await currentComic.save();
};

const getComicsByListHashName = async (listHashName) => {
  return await comic.find({ hashName: { $in: listHashName } });
};

module.exports = {
  createNewComic,
  getComic,
  getComics,
  getComicsByName,
  getFullComicsCount,
  getComicsCount,
  comicToggleLike,
  comicToggleFollow,
  voteComic,
  comicReceivedView,
  getComicsByListHashName,
};
