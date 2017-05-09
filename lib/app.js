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
const songs = require('./routes/songs');

app.use('/users', users);
app.use('/spotify', spotify);
app.use('/songs', songs);

module.exports = app;
