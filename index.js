const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const appuserRoute = require('./routes/appuser');
const categoryRoute = require('./routes/category');
const articleRoute = require('./routes/article');
const chatRoute = require('./routes/chat');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/appuser', appuserRoute);
app.use('/category', categoryRoute);
app.use('/article', articleRoute);
app.use('/chat', chatRoute);

module.exports = app;