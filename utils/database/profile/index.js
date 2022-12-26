const users = require('../../../models/users');
const level = require('../../config/level');

const getUser = async (data) => await users.findOne({ ...data });

const getUserProfile = async (data) => {
  const currentUser = await getUser(data);

  if (currentUser) {
    return {
      id: currentUser.id,
      userName: currentUser._doc.userName,
      email: currentUser._doc.email,
      firstName: currentUser._doc.firstName,
      lastName: currentUser._doc.lastName,
      dob: currentUser._doc.dob,
      gender: currentUser._doc.gender,
      avatar: currentUser._doc.avatar,
      level: {
        current: currentUser._doc.level.current,
        next:
          currentUser._doc.level.exp / level[currentUser._doc.level.current],
      },
    };
  }

  return null;
};

const updateUserProfile = async (userData) => {
  const { id, userName, ...data } = userData;
  const currentUser = await getUser({ id, userName });

  try {
    if (currentUser) {
      Object.keys(data).forEach((key) => {
        if (!!data[key]) {
          currentUser[key] = data[key];
        }
      });

      await currentUser.save();
      return {
        id: currentUser.id,
        userName: currentUser._doc.userName,
        email: currentUser._doc.email,
        firstName: currentUser._doc.firstName,
        lastName: currentUser._doc.lastName,
        dob: currentUser._doc.dob,
        gender: currentUser._doc.gender,
        avatar: currentUser._doc.avatar,
        level: {
          current: currentUser._doc.level.current,
          next:
            currentUser._doc.level.exp / level[currentUser._doc.level.current],
        },
      };
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
