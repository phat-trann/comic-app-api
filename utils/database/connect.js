const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = () => {
  try {
    mongoose.connect(process.env.DB_URL, () => console.log('Database was connected'));
  } catch (error) {
    console.error(error);
  }
};

const disconnectDB = async (connection) => await connection.close();

module.exports = {
  connectDB,
  disconnectDB,
};
