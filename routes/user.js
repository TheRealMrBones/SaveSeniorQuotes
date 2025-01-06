const express = require('express');
const router = express.Router();
const validator = require('validator');
const {OAuth2Client} = require('google-auth-library');

const userController = require('../controllers/userController');

// Register route
router.get('/register', (req, res) => {
    if (res.locals.username) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

router.post('/user/register', async (req, res) => {
    let { username, password } = req.body;

    // Sanitize and validate username
    username = validator.trim(username);
    username = typeof username === 'string' ? username.toLowerCase() : '';

    // Sanitize password
    password = validator.trim(password);

    // Check if username or password are empty after trimming
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Proceed with registration
    const result = await userController.registerUser(username, password);
    return res.status(result.error ? 400 : 201).json(result);
});

// Login route
router.get('/login', (req, res) => {
    if (res.locals.username) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/user/login', async (req, res) => {
    res.header('Access-Control-Allow-Origin','http://localhost:3000');
    res.header('Referrer-Policy','no-referrer-when-downgrade');

    const redirectUrl = 'http://localhost:3000/user/oauth';

    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent',
    });

    res.json({url: authorizeUrl});
});

async function getUserData(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
}

router.get('/user/oauth', async (req, res, next) => {
    const code = req.query.code;
    try{
        const redirectUrl = 'http://localhost:3000/user/oauth';
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);

        const usercred = oAuth2Client.credentials;
        await getUserData(usercred.access_token);
    }catch(err){
        console.log('Error signing in with Google');
    }
});

// Profile route
router.get('/profile', (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        res.render('profile');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// Reset password route
router.get('/resetpassword', async (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        res.render('resetpassword');
    }
});

router.post('/user/resetpassword', async (req, res) => {
    let { password } = req.body;
    let userId = res.locals.userId;

    // Sanitize password
    password = validator.trim(password);
    password = validator.escape(password);

    const result = await userController.updateUserPassword(userId, password);

    return res.status(result.error ? 401 : 201).json(result);
});

// Delete user route
router.get('/deleteUser', (req, res) => {
    res.render('delete-user');
});

router.post('/user/deleteUser', async (req, res) => {
    try {
        const userId = res.locals.userId;

        // Delete the user
        await userController.deleteUserById(userId);
        res.clearCookie('token');
        res.redirect('/');

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;