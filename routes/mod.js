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

router.post('/review', async (req, res) => {
    if (res.locals.accessLvl < 1) {
        return;
    }

    let { userId, accept, reason } = req.body;

    const result = await userController.submitReview(userId, accept, reason);

    return res.status(result.error ? 401 : 201).json(result);
});

module.exports = router;