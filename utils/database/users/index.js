const users = require('../../../models/users');
const md5 = require('md5');

const getUser = async (data) => {
  const currentUser = await users.findOne({
    ...data,
  });

  return currentUser;
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
      userName: data.userName,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getUser,
  createNewUser,
};
