const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const { connectDB } = require('./utils/database/connect');
const indexRouter = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./comic-app.yaml');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));

connectDB();

app.use('/api', indexRouter);

module.exports = app;
