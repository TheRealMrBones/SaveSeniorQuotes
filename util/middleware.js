const moment = require('moment');
const path = require('path');
const userController = require('../controllers/userController');

// File path middleware
const setFilePath = async (req, res, next) => {
    const currentPath = path.resolve(__dirname);
    res.locals.filepath = currentPath;
    next();
};

// Check user status middleware
const checkUserStatus = async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        const verificationResult = userController.verifyToken(token);

        if (verificationResult.valid) {
            // Token is valid, you can use the verified data
            res.locals.username = verificationResult.username;

            // Set userId in the locals for future use
            const userId = await userController.getIdFromUsername(verificationResult.username);

            if (userId) {
                res.locals.userId = userId;
            } else {
                // User is not valid
                res.locals.userId = null;
                res.locals.username = null;
                res.clearCookie('token');
            }

        } else {
            // Token is not valid,
            res.locals.userId = null;
            res.locals.username = null;
            res.clearCookie('token');
        }
    } else {
        // No token present
        res.locals.userId = null;
        res.locals.username = null;
        res.clearCookie('token');
    }

    next();
};

// Check access level middleware
const checkAccessLvl = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        if (!userId) {
            res.locals.accessLvl = 0;
        }else{
            res.locals.accessLvl = await userController.getAccessLvl(userId);
        }

        next();
    } catch (error) {
        console.error('Error checking access level:', error);
        res.locals.accessLvl = 0;
        next(error);
    }
};

// Console.log requests into the terminal
const requestLogger = (req, res, next) => {
    const timestamp = moment().format('MM-DD HH:mm:ss');
    const method = req.method;
    const url = req.url;
    const ip = req.ip;

    res.on('finish', () => {
        const statusCode = res.statusCode;
        const responseTime = new Date() - req.startTime;
        let statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
        console.log(`\x1b[36m[${timestamp}] \x1b[32m${method} \x1b[36m${url} from \x1b[33m${ip} ${statusColor}${statusCode}\x1b[0m - ${responseTime}ms`);
    });

    req.startTime = new Date();
    next();
};

module.exports = {
    setFilePath,
    checkUserStatus,
    checkAccessLvl,
    requestLogger,
};