const LEVEL_EXP_DEFINE = require('../config/level');
const TYPE_DEFINE = {
  READ_NEW_CHAPTER: {
    exp: 50,
    refresh: 600000,
  },
  COMMENT: {
    exp: 1,
    refresh: 60000,
  },
  OWN_COMMENT_S_LIKED: {
    exp: 10,
    refresh: 0,
  },
  OWN_COMMENT_S_DISLIKED: {
    exp: -10,
    refresh: 0,
  },
};

const receivedExp = (current, exp, lastReceived, type) => {
  if (new Date(lastReceived).getTime() + TYPE_DEFINE[type].refresh > Date.now())
    return {
      current,
      exp,
      lastReceived,
    };

  let newCurrent = current;
  let newExp = exp + TYPE_DEFINE[type].exp;
  const newLastReceived =
    TYPE_DEFINE[type].refresh > 0 ? Date.now() : lastReceived;

  if (newExp >= LEVEL_EXP_DEFINE[newCurrent + 1]) {
    newCurrent += 1;
    newExp -= LEVEL_EXP_DEFINE[newCurrent];
  }

  return {
    current: newCurrent,
    exp: newExp,
    lastReceived: newLastReceived,
  };
};

module.exports = {
  receivedExp,
};
