const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Main mod route
router.get('/*', (req, res, next) => {
    if (res.locals.accessLvl < 1) {
        res.redirect('/');
    } else {
        next();
    }
});

// Review route
router.get('/review', (req, res, next) => {
    
});

module.exports = router;