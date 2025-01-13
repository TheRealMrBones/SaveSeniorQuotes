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

router.get('/promoteUser', async (req, res) => {
    const accessLvl = parseInt(req.query.lvl);
    const username = req.query.username;

    if(username === undefined || accessLvl === undefined || accessLvl === NaN){
        res.redirect('/');
        return;
    }

    const userId = (await userController.getUserByUsername(username)).id;
    
    if(!userId){
        res.redirect('/');
        return;
    }

    const result = await userController.setAccessLvl(userId, accessLvl);

    if(result){
        console.log(`${username} has been promoted by ${res.locals.username}`);
    }

    res.redirect('/');
});

module.exports = router;