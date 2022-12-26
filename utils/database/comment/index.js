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

module.exports = {
  createNewComment,
};
