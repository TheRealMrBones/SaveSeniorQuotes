const userModel = require('../models/userModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const getApiKeyById = async (userId) => {
    try {
        const apiKey = await userModel.getApiKeyById(userId);
        return apiKey;
    } catch (error) {
        console.error('Error in getApiKeyById:', error);
        return null;
    }
};

const verifyApiKey = async (apiKey) => {
    try {
        const isValid = await userModel.verifyApiKey(apiKey);
        return isValid;
    } catch (error) {
        console.error('Error in verifyApiKey:', error);
        return false;
    }
};

const newApiKey = async (userId) => {
    try {
        const newApiKey = await userModel.renewApiKey(userId);
        return newApiKey;
    } catch (error) {
        console.error('Error in renewApiKey:', error);
        return null;
    }
};

const getAccessLvl = async (userId) => {
    try {
        const accessLvl = await userModel.getAccessLvl(userId);
        return accessLvl;
    } catch (error) {
        console.error('Error in getAccessLvl:', error);
        return false;
    }
};

const getUserById = async (userId) => {
    try {
        const user = await userModel.getUserById(userId);
        return user;
    } catch (error) {
        console.error('Error in getUserById:', error);
        return null;
    }
};

const getUsernameById = async (userId) => {
    try {
        const user = await userModel.getUsernameById(userId);
        return user;
    } catch (error) {
        console.error('Error in getUserById:', error);
        return null;
    }
};

const getUserByUsername = async (username) => {
    try {
        const user = await userModel.getUserByUsername(username);
        return user;
    } catch (error) {
        console.error('Error in getUserByUsername:', error);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        return await userModel.getAllUsers();
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
};

const registerUser = async (username, password) => {
    username = sanitizeInput(username).toLowerCase();
    password = sanitizeInput(password);

    // Validate username
    if (username.length < 3 || username.length > 20 || !isAlphanumeric(username)) {
        return { error: 'Invalid username. It must be 3-20 characters only letters, numbers, and underscores.' };
    }

    const existingUser = await userModel.getUserByUsername(username);

    if (existingUser) {
        return { error: 'Username already exists' };
    }

    try {
        const hashedPw = await argon2.hash(password);

        const user = await userModel.createUser({ username, hashedPw });

        return { message: 'User registered successfully' };
    } catch (error) {
        console.error('Error in registerUser:', error);
        return { error: 'Error registering user' };
    }
};

const loginUser = async (username, password) => {
    // Sanitize inputs
    username = sanitizeInput(username);
    password = sanitizeInput(password);

    try {
        const user = await userModel.getUserByUsername(username);

        if (!user) {
            return { error: 'Invalid username or password' };
        }

        const passwordMatch = await argon2.verify(user.hashedPw, password);
        if (!passwordMatch) {
            return { error: 'Invalid username or password' };
        }

        const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '24h' });
        return { token };
    } catch (error) {
        console.error('Error in loginUser:', error);
        throw error;
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return { valid: true, username: decoded.username, token: token };
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return { valid: false, error: error.message };
    }
};

const updateUserPassword = async (userId, password) => {
    try {
        const newHashedPw = await argon2.hash(password);

        return await userModel.updateUserPassword(userId, newHashedPw);
    } catch (error) {
        console.error('Error in updateUserPassword:', error);
        throw error;
    }
};

const getUserByApiKey = async (apiKey) => {
    try {
        return await userModel.getUserByApiKey(apiKey);
    } catch (error) {
        console.error('Error in getUserByApiKey:', error);
        throw error;
    }
};

const deleteUserById = async (userId) => {
    try {
        const result = await userModel.deleteUserById(userId);
        return result;
    } catch (error) {
        console.error('Error in deleteUserById:', error);
        return { error: 'Error deleting user' };
    }
};

const getIdFromUsername = async (username) => {
    try {
        const user = await userModel.getUserByUsername(username);
        return user ? user.id : null;
    } catch (error) {
        console.error('Error in getIdFromUsername:', error);
        throw error;
    }
};

const updateProfile = async (userId, data) => {
    try {
        return await userModel.updateProfile(userId, data);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        throw error;
    }
};

const sendVerif = async (userId) => {
    try {
        return await userModel.sendVerif(userId);
    } catch (error) {
        console.error('Error in sendVerif:', error);
        throw error;
    }
};

const getUsersPage = async (page, perPage) => {
    try {
        const users = await userModel.getUsersPage(page, perPage, false, false);
        
        return users;
    } catch (error) {
        console.error('Error in getUsersPage:', error);
        throw error;
    }
};

const getQuotesPage = async (page, perPage, formods) => {
    try {
        // if not for mods get only accepted if for mods get only review
        const users = await userModel.getUsersPage(page, perPage, !formods, formods);

        return users.map(user => {
            const returnobject = {
                picture: user.picture,
                firstname: user.firstname,
                lastname: user.lastname,
                quote: user.quote,
            }

            // only include user info if for mods
            if (formods) {
                returnobject.userId = user.id;
                returnobject.username = user.username;
            }

            return returnobject;
        });
    } catch (error) {
        console.error('Error in getQuotesPage:', error);
        throw error;
    }
};

const submitReview = async (userId, accept, reason) => {
    try {
        return await userModel.submitReview(userId, accept, reason);
    } catch (error) {
        console.error('Error in submitReview:', error);
        throw error;
    }
};

// Function to check if a string is alphanumeric
const isAlphanumeric = (str) => /^[a-zA-Z0-9_]*$/.test(str);

// Sanitize input
const sanitizeInput = (input) => validator.escape(input);

module.exports = {
    getApiKeyById,
    verifyApiKey,
    newApiKey,
    getAccessLvl,
    getUserById,
    getUsernameById,
    getUserByUsername,
    getAllUsers,
    registerUser,
    loginUser,
    updateUserPassword,
    verifyToken,
    getUserByApiKey,
    deleteUserById,
    getIdFromUsername,
    updateProfile,
    sendVerif,
    getUsersPage,
    getQuotesPage,
    submitReview,
};