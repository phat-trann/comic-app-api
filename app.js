const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const { connectDB } = require('./utils/database/connect');

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const comicRouter = require('./routes/comic');
const chaptersRouter = require('./routes/chapters');
const commentRouter = require('./routes/comment');
const categoryRouter = require('./routes/category');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/comic', comicRouter);
app.use('/chapters', chaptersRouter);
app.use('/comment', commentRouter);
app.use('/category', categoryRouter);

module.exports = app;
