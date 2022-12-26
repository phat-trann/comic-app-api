const comment = require('../../../models/comment');

const getComment = async (data) => {
  const currentComment = await comment.findOne({
    ...data,
  });

  return currentComment;
};

const createNewComment = async (data) => {
  try {
    const { parentId, ...otherData } = data;
    const newComment = new comment({
      ...otherData,
      isReply: !!parentId,
      replies: [],
      vote: {
        like: [],
        dislike: [],
      },
      createDate: Date.now(),
    });
    await newComment.save();

    if (parentId) {
      const parentComment = await getComment({ id: parentId });
      parentComment.replies = [newComment.id, ...parentComment.replies];
      await parentComment.save();
    }

    return newComment;
  } catch (error) {
    throw error;
  }
};

const getComments = async ({ comicHashName, chapterHashName, current }) => {
  let searchData = {
    isReply: false,
  };

  if (comicHashName) {
    searchData = { comicHashName };
  }

  if (chapterHashName) {
    searchData = { chapterHashName };
  }

  const comments = await comment
    .find({ ...searchData })
    .skip(current)
    .limit(10)
    .sort([['createDate', 1]]);

  const finalData = await Promise.all(
    comments.map(async (cmt) => {
      const data = { ...cmt._doc };
      const replies = data.replies;

      if (replies?.length) {
        const repliesData = await comment
          .find({ _id: { $in: replies } })
          .sort([['createDate', 1]]);
        data.replies = repliesData;
      }

      return data;
    })
  );

  return finalData;
};

const removeComment = async (query, currentUser) => {
  const currentComment = await getComment(query);

  if (
    currentComment &&
    (currentUser?.admin || currentComment?.author?.id === currentUser?.id)
  ) {
    if (!currentComment.isReply) {
      const repliesData = await comment.find({
        _id: { $in: currentComment?._doc?.replies },
      });

      if (repliesData?.length) {
        await Promise.all(
          repliesData.forEach(async (reply) => {
            await reply.remove();
          })
        );
      }
    }

    await currentComment.remove();

    return true;
  }

  return false;
};

module.exports = {
  createNewComment,
  removeComment,
  getComments,
};
