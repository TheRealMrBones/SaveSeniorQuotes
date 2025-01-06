const express = require('express');
const router = express.Router();
const validator = require('validator');

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
    let { username, password } = req.body;

    // Sanitize username
    username = validator.trim(username);
    username = validator.escape(username);

    // Sanitize password
    password = validator.trim(password);
    password = validator.escape(password);

    const lowercaseUsername = username.toLowerCase();
    const result = await userController.loginUser(lowercaseUsername, password);

    // Set cookie and update visit
    if (result.token) {
        res.cookie("token", result.token);
    }

    return res.status(result.error ? 401 : 200).json(result);
});

// Profile route
router.get('/profile', async (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        const userId = res.locals.userId;
        const user = await userController.getUserById(userId);

        res.locals.firstname = user.firstname ?? "not set";
        res.locals.lastname = user.lastname ?? "not set";
        res.locals.quote = user.quote ?? "not set";

        res.render('profile');
    }
});

// Update profile route
router.get('/updateprofile', (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        const userId = res.locals.userId;
        const user = userController.getUserById(userId);

        res.locals.firstname = user.firstname ?? "not set";
        res.locals.lastname = user.lastname ?? "not set";
        res.locals.quote = user.quote ?? "not set";

        res.render('updateprofile');
    }
});

router.post('/user/updateprofile', async (req, res) => {
    try {
        const userId = res.locals.userId;

        const { firstname, lastname, quote } = req.body;

        const sanitizedFirstname = validator.trim(firstname);
        const sanitizedLastname = validator.trim(lastname);
        const sanitizedQuote = validator.trim(quote);

        await userController.updateProfile(userId, {
            firstname: sanitizedFirstname,
            lastname: sanitizedLastname,
            quote: sanitizedQuote,
        });

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Internal Server Error');
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