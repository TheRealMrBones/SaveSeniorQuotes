const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const {
    setFilePath,
    checkAccessLvl,
    checkUserStatus,
    requestLogger,
} = require('./util/middleware');

// Init Express
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(setFilePath);
app.use(checkAccessLvl);
app.use(checkUserStatus);
app.use(requestLogger);

// Routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

// Serve Homepage
app.get('/', async (req, res) => {
    res.render("index")
});

// Error Routes
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);

    if (req.originalUrl.startsWith('/api')) {
        return res.json({ error: 'Internal server error' });
    }

    res.render('500');
});

// Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;