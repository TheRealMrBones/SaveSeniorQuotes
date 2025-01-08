const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');

const userController = require('../controllers/userController');

// Multer config
const pictureUpload = multer({
    dest: './public/uploads/tmp',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024,
    },
});

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
        res.locals.picture = user.picture ?? "/public/missingpicture.png";

        res.locals.verified = user.verified;
        res.locals.statusLvl = user.statusLvl;
        res.locals.deniedMsg = user.deniedMsg;

        res.locals.submissionstatusclass = "";
        if(user.statusLvl == 1){
            res.locals.submissionstatusclass = "submissionstatusreview";
        }else if(user.statusLvl == 2 || user.statusLvl == 0){
            res.locals.submissionstatusclass = "submissionstatusdenied";
        }else if(user.statusLvl == 3){
            res.locals.submissionstatusclass = "submissionstatusaccepted";
        }

        res.render('profile');
    }
});

// Verify route
router.get('/verify', async (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        const userId = res.locals.userId;
        const user = await userController.getUserById(userId);
        
        // fill in later

        res.render('verify');
    }
});

router.post('/user/verify', async (req, res) => {
    try {
        const userId = res.locals.userId;
        await userController.sendVerif(userId);
        res.redirect('/updateprofile');
    } catch (error) {
        console.error('Error verifying identity:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update profile route
router.get('/updateprofile', async (req, res) => {
    if (!res.locals.username) {
        res.redirect('/');
    } else {
        const userId = res.locals.userId;
        const user = await userController.getUserById(userId);

        // redirect to verification if needed
        if (!user.sentVerif) {
            res.redirect('/verify');
            return;
        }

        res.locals.firstname = user.firstname;
        res.locals.lastname = user.lastname;
        res.locals.quote = user.quote;
        res.locals.picture = user.picture;

        res.render('updateprofile');
    }
});

router.post('/user/updateprofile', pictureUpload.single('picture'), async (req, res) => {
    try {
        const userId = res.locals.userId;
        const username = res.locals.username;
        const user = await userController.getUserById(userId);

        const { firstname, lastname, quote } = req.body;

        const sanitizedFirstname = firstname ? validator.trim(firstname) : null;
        const sanitizedLastname = lastname ? validator.trim(lastname) : null;
        const sanitizedQuote = quote ? validator.trim(quote) : null;

        let newFilepath = null;
        if(req.file){
            const { path, originalname } = req.file;
            const newFilename = username + "." + originalname.split(".")[1];
            newFilepath = `/public/uploads/pictures/${newFilename}`;
            fs.renameSync(path, "." + newFilepath);
        }

        await userController.updateProfile(userId, {
            firstname: sanitizedFirstname ?? user.firstname,
            lastname: sanitizedLastname ?? user.lastname,
            quote: sanitizedQuote ?? user.quote,
            picture: newFilepath ?? user.picture,
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