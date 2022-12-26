const chapter = require('../../../models/chapter');

const getChapter = async (comicHashName, chapterId) => {
  return await chapter.findOne({
    hashName: [comicHashName, chapterId].join('/'),
  });
};

const chapterReceivedView = async (currentChapter) => {
  currentChapter.views = currentChapter._doc.views + 1;
  await currentChapter.save();
};

module.exports = {
  getChapter,
  chapterReceivedView,
};
