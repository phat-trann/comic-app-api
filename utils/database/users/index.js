const users = require('../../../models/users');
const md5 = require('md5');

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

module.exports = {
  getUser,
  createNewUser,
  verifyUser,
};
