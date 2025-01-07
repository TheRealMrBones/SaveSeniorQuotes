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

module.exports = router;