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
router.get('/review', async (req, res) => {
    const page = req.query.page || 1;

    res.locals.page = page;
    res.locals.quotes = await userController.getQuotesPage(page, 25, true);

    res.render("review")
});

module.exports = router;