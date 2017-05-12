require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const express = require('express');
const ensureAuth = require('./auth/ensure-auth')();

const app = express();

app.use(express.static('./public'))
    .use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser());

const auth = require('./routes/auth');
const spotify = require('./routes/spotify');
const users = require('./routes/users');
const playlists = require('./routes/playlists');
const songs = require('./routes/songs');

app.use('/auth', auth);
app.use('/spotify', spotify);
app.use('/users', ensureAuth, users);
app.use('/playlists', ensureAuth, playlists);
app.use('/songs', ensureAuth, songs);

module.exports = app;
