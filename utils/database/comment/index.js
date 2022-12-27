const comment = require('../../../models/comment');
const { getUser, userReceivedExp } = require('../users');

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

const actionComment = async (action, id, user) => {
  if (!action || !id) return null;
  const currentComment = await getComment({ id });
  const userId = user._doc._id;

  if (!currentComment || !userId || !['like', 'dislike'].includes(action))
    return null;

  const currentData = currentComment._doc.vote?.[action] || [];
  const authorComment = await getUser({ id: currentComment._doc.author.id });
  let current = currentData.length;
  let is = false;

  if (currentData.includes(userId)) {
    currentComment.vote[action] = currentData.filter((el) => {
      return el !== String(userId);
    });
    current -= 1;

    await userReceivedExp(
      authorComment,
      action === 'like' ? 'OWN_COMMENT_S_DISLIKED' : 'OWN_COMMENT_S_LIKED'
    );
  } else {
    currentComment.vote[action] = [...currentData, userId];
    current += 1;
    is = true;

    await userReceivedExp(
      authorComment,
      action === 'dislike' ? 'OWN_COMMENT_S_DISLIKED' : 'OWN_COMMENT_S_LIKED'
    );

    const otherAction = ['like', 'dislike'].find((el) => el !== action);
    const currentOtherData = currentComment._doc.vote?.[otherAction] || [];

    if (currentOtherData.includes(userId)) {
      currentComment.vote[otherAction] = currentOtherData.filter((el) => {
        return el !== String(userId);
      });

      await userReceivedExp(
        authorComment,
        otherAction === 'like'
          ? 'OWN_COMMENT_S_DISLIKED'
          : 'OWN_COMMENT_S_LIKED'
      );
    }
  }
  await currentComment.save();
  await authorComment.save();

  return {
    current,
    is,
  };
};

module.exports = {
  createNewComment,
  removeComment,
  getComments,
  actionComment,
};
