const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const path = require('path');
const signupController = require('./controllers/signup');
const app = express();

// Set up mustache as the templating engine
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware to handle URL-encoded data from POST requests
app.use(express.urlencoded({ extended: false }));

// Session middleware configuration
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// Populate an initial template array for each request
app.use((req, res, next) => {
  req.TPL = {
    displaylogin: !req.session.username,
    displaylogout: !!req.session.username
  };
  next();
});

// Set up navigational highlighting dynamically
const navHighlightingMiddleware = (req, res, next) => {
  const pathMap = {
    '/home': 'homenav',
    '/articles': 'articlesnav',
    '/members': 'membersnav',
    '/editors': 'editorsnav',
    '/login': 'loginnav'
  };
  req.TPL = { ...req.TPL, [pathMap[req.path]]: true };
  next();
};
app.use(navHighlightingMiddleware);

// Middleware to protect access to the members page
app.use('/members', (req, res, next) => {
  req.session.username ? next() : res.redirect('/home');
});

// Middleware to restrict access to editors page
app.use('/editors', (req, res, next) => {
  req.session.access_level === 'editor' ? next() : res.redirect('/home');
});

// Log each request to log.txt in the required format
const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
  weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  timeZoneName: 'long'
}).format(date);

app.use((req, res, next) => {
  const logEntry = [
    formatDate(new Date()), req.path, req.ip,
    JSON.stringify(req.query), JSON.stringify(req.body)
  ].join(', ') + '\n';

  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) console.error('Failed to write to log.txt', err);
  });
  next();
});

// Route Handlers
app.use('/home', require('./controllers/home'));
app.use('/articles', require('./controllers/articles'));
app.use('/members', require('./controllers/members'));
app.use('/editors', require('./controllers/editors'));
app.use('/login', require('./controllers/login'));
app.use('/signup', signupController);

// Redirect root to /home
app.get('/', (req, res) => res.redirect('/home'));

// Serve static files or respond with a 404
app.get(/^(.+)$/, (req, res) => {
  const filePath = path.join(__dirname, req.params[0]);
  fs.existsSync(filePath) ? res.sendFile(filePath) : res.status(404).send('Not found');
});

// Start the server
app.listen(3000, () => console.log("Server listening..."));
