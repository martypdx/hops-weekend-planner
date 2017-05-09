require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const express = require('express');

const app = express();

app.use(express.static('./public'))
    .use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());

const users = require('./routes/users');
const spotify = require('./routes/spotify');

app.use('/users', users);
app.use('/spotify', spotify);

module.exports = app;
