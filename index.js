const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const {
    setFilePath,
    checkUserStatus,
    checkAccessLvl,
    requestLogger,
} = require('./util/middleware');

const userController = require('./controllers/userController');

// Init Express
const app = express();
const port = 3000;

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(setFilePath);
app.use(checkUserStatus);
app.use(checkAccessLvl);
app.use(requestLogger);

// Routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

const modRoutes = require('./routes/mod');
app.use('/mod', modRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Serve Homepage
app.get('/', async (req, res) => {
    res.locals.quotes = await userController.getQuotesPage(1, 25, false);
    res.locals.usercount = await userController.countAllUsers();
    res.locals.quotecount = await userController.countUsersByStatus(3);

    const userId = res.locals.userId;
    const user = await userController.getUserById(userId);

    res.locals.statusLvl = 0;
    if(user){
        res.locals.statusLvl = user.statusLvl;
        res.locals.deniedMsg = user.deniedMsg;
    }

    res.render("index")
});

// Serve Gallery
app.get('/gallery', async (req, res) => {
    const page = req.query.page || 1;

    res.locals.page = page;
    res.locals.quotes = await userController.getQuotesPage(page, 25, false);

    res.render("gallery")
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