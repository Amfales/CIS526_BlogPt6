const express = require('express');
const serveHomepage = require('./endpoints/serve-homepage');
const newPost = require('./endpoints/new-post');
const createPost = require('./endpoints/create-post');
const showPost = require('./endpoints/show-post');
const loadBody = require('./middleware/load-body');
const serveError = require('./serve-error');
const loadSession = require('./middleware/loadSession');
const authorsOnly = require('./middleware/authors-only');
const createUser = require('./endpoints/create-user');

/** @module app 
 * The express application for our site
 */
var app = express();

app.use(loadSession);

app.get('/', serveHomepage);

app.get('/signin', createUser);


app.get('/posts/new', authorsOnly, newPost);
app.post('/posts', authorsOnly, loadBody, createPost);
app.get('/posts/:id', showPost);

app.use(express.static('public'));

module.exports = app;