const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const { connectDB } = require('./utils/database/connect');

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const comicRouter = require('./routes/comic');

const app = express();

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

module.exports = app;
