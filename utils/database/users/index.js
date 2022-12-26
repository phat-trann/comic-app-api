const users = require('../../../models/users');
const md5 = require('md5');
const { receivedExp } = require('../../helpers/level');

const getUser = async (data) => {
  const currentUser = await users.findOne({
    ...data,
  });

  return currentUser;
};

const verifyUser = async (data) => {
  try {
    if (!(await getUser({ userName: data.userName })))
      return {
        error: true,
        message: 'User not found',
      };
    const currentUser = await getUser({
      userName: data.userName,
      password: md5(data.password),
    });

    if (currentUser) {
      return {
        id: currentUser.id,
        userName: currentUser._doc.userName,
        email: currentUser._doc.email,
        firstName: currentUser._doc.firstName,
        lastName: currentUser._doc.lastName,
      };
    }

    return {
      error: true,
      message: 'Password is not correct',
    };
  } catch (error) {
    throw error;
  }
};

const createNewUser = async (data) => {
  try {
    if (await getUser({ email: data.email }))
      return {
        error: true,
        message: 'Email already exists',
      };
    if (await getUser({ userName: data.userName }))
      return {
        error: true,
        message: 'Username already exists',
      };
    const newUser = new users({
      admin: false,
      ...data,
      password: md5(data.password),
      level: 0,
      follows: [],
    });
    await newUser.save();

    return {
      id: newUser.id,
      userName: newUser._doc.userName,
      email: newUser._doc.email,
      firstName: newUser._doc.firstName,
      lastName: newUser._doc.lastName,
    };
  } catch (error) {
    throw error;
  }
};

const isAdmin = async (data) => {
  const currentUser = await getUser(data);

  return currentUser?._doc?.admin;
};

const userToggleLikeComic = async (user, hashName, isLike) => {
  try {
    if (isLike) user.likes = [...user._doc.likes, hashName];
    else user.likes = user._doc.likes.filter((liked) => liked !== hashName);

    await user.save();

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const userReceivedExp = async (user) => {
  try {
    user.level = {
      ...receivedExp(
        user._doc.level?.current || 0,
        user._doc.level?.exp || 0,
        user._doc.level?.lastReceived || Date.now(),
        'READ_NEW_CHAPTER'
      ),
    };

    await user.save();

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const userSaveHistory = async (user, hashName, chapter) => {
  const currentHistory = user._doc.history || [];

  user.history = [
    `${hashName}/${chapter}`,
    ...currentHistory.filter(
      (chapHashName) => chapHashName.split('/')[0] !== hashName
    ),
  ];

  await user.save();
};

const userVoteComic = async (user, hashName) => {
  try {
    user.votes = [...user._doc.votes, hashName];

    await user.save();

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  getUser,
  createNewUser,
  verifyUser,
  isAdmin,
  userToggleLikeComic,
  userReceivedExp,
  userVoteComic,
  userSaveHistory,
};
