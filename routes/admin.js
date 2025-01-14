const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Main admin route
router.get('/*', (req, res, next) => {
    if (res.locals.accessLvl < 2) {
        res.redirect('/');
    } else {
        next();
    }
});

// Promote user route
router.get('/promoteUser', async (req, res) => {
    const accessLvl = parseInt(req.query.lvl);
    const username = req.query.username;

    if(username === undefined || accessLvl === undefined || accessLvl === NaN){
        res.redirect('/');
        return;
    }

    const user = await userController.getUserByUsername(username);
    if(!user){
        res.redirect('/');
        return;
    }
    const userId = user.id;

    const result = await userController.setAccessLvl(userId, accessLvl);

    if(result){
        console.log(`${username} has been promoted by ${res.locals.username}`);
    }

    res.redirect('/');
});

// Delete user route
router.get('/deleteUser', async (req, res) => {
    const username = req.query.username;

    if(username === undefined){
        res.redirect('/');
        return;
    }

    const user = await userController.getUserByUsername(username);
    if(!user){
        res.redirect('/');
        return;
    }
    const userId = user.id;

    const result = await userController.deleteUserById(userId);

    if(result){
        console.log(`${username} has been deleted by ${res.locals.username}`);
    }

    res.redirect('/');
});

// Set state route
router.get('/setState', async (req, res) => {
    const stateLvl = parseInt(req.query.lvl);
    const reason = req.query.reason;
    const username = req.query.username;

    if(username === undefined || stateLvl === undefined || stateLvl === NaN){
        res.redirect('/');
        return;
    }

    const user = await userController.getUserByUsername(username);
    if(!user){
        res.redirect('/');
        return;
    }
    const userId = user.id;

    const result = await userController.submitReview(userId, stateLvl, reason);

    if(result){
        console.log(`${username}'s state has been reset by ${res.locals.username}`);
    }

    res.redirect('/');
});

module.exports = router;