const bodyParser = require('body-parser');
const morgan = require('morgan');

const express = require('express');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

//TODO: Build routes for breweries, brews and users
//TODO: Enable app.use for routes

module.exports = app;
