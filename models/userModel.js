const crypto = require('crypto');
const fs = require('fs');
const db = require('../util/db');
const prisma = db.prisma;

const generateApiKey = () => crypto.randomUUID();

const getApiKeyById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user?.apiKey;
    } catch (error) {
        console.error('Error in getApiKeyById:', error);
        return null;
    }
};

const verifyApiKey = async (apiKey) => {
    try {
        const user = await prisma.user.findFirst({
            where: { apiKey: apiKey },
        });
        return !!user;
    } catch (error) {
        console.error('Error in verifyApiKey:', error);
        return false;
    }
};

const getUserByApiKey = async (apiKey) => {
    try {
        return await prisma.user.findFirst({
            where: { apiKey: apiKey },
        });
    } catch (error) {
        console.error('Error in getUserByApiKey:', error);
        return null;
    }
};

const newApiKey = async (userId) => {
    try {
        const newApiKey = generateApiKey();
        await prisma.user.update({
            where: { id: userId },
            data: { apiKey: newApiKey },
        });
        return newApiKey;
    } catch (error) {
        console.error('Error in newApiKey:', error);
        return null;
    }
};

const getAccessLvl = async (userId) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user?.accessLvl || 0;
    } catch (error) {
        console.error('Error in getAccessLvl:', error);
        return false;
    }
};

const setAccessLvl = async (userId, accessLvl) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { accessLvl: accessLvl },
        });
        return true;
    } catch (error) {
        console.error('Error in setAccessLvl:', error);
        return false;
    }
};

const getUserByUsername = async (username) => {
    try {
        return await prisma.user.findUnique({ where: { username: username } });
    } catch (error) {
        console.error('Error in getUserByUsername:', error);
        return null;
    }
};

const getUsernameById = async (id) => {
    try {
        if (!id) {
            return null;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: String(id)
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user.username;
    } catch (error) {
        console.error('Error in getUsernameById:', error);
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        if (!id) {
            return null;
        }
        return await prisma.user.findUnique({
            where: {
                id: String(id)
            }
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return null;
    }
};

const createUser = async ({ username, hashedPw }) => {
    try {
        const apiKey = generateApiKey();
        const user = await prisma.user.create({
            data: { username, hashedPw, apiKey },
        });
        return user;
    } catch (error) {
        console.error('Error in createUser:', error);
        return null;
    }
};

const updateUserPassword = async (userId, hashedPassword) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { hashedPw: hashedPassword },
        });

        return updatedUser;
    } catch (error) {
        console.error('Error in updateUserPassword:', error);
        return null;
    }
};

const deleteUserById = async (userId) => {
    try {
        await prisma.user.delete({ where: { id: userId } });
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error in deleteUserById:', error);
        return { error: 'Error deleting user' };
    }
};

const updateProfile = async (userId, {
    firstname,
    lastname,
    quote,
    picture,
}) => {
    try {
        if (picture) {
            if (!fs.existsSync("." + picture))
                picture = null;
        }

        return await prisma.user.update({
            where: { id: userId },
            data: {
                firstname,
                lastname,
                quote,
                picture,
                statusLvl: 1, // pending review from mods
            }
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        return null;
    }
};

const sendVerif = async (userId) => {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: { sentVerif: true }
        });
    } catch (error) {
        console.error('Error in sendVerif:', error);
        return null;
    }
};

const getUsersPage = async (page, perPage, onlyaccepted, onlyreview) => {
    try {
        let where = null;
        if (onlyaccepted)
            where = { statusLvl: { equals: 3 } };
        else if(onlyreview)
            where = { statusLvl: { equals: 1 } };

        let orderBy = [{ lastname: 'asc' }, { firstname: 'asc' }];
        if (onlyreview)
            orderBy = { updatedAt: 'desc' };

        // Adjust pagination if necessary
        let skip = 0;
        let take = Number.MAX_SAFE_INTEGER; // Maximum safe integer
        if (page && perPage) {
            skip = (page - 1) * perPage;
            take = perPage;
        } else if (page && !perPage) {
            // If page is provided but perPage is not, use a default value for perPage
            take = 25; // Default value for perPage
            skip = (page - 1) * take;
        }

        // Fetch all quotes
        const users = await prisma.user.findMany({
            where,
            orderBy,
            skip,
            take,
        });

        return users;
    } catch (error) {
        console.error('Error in getUsersPage:', error);
        return null;
    }
};

const submitReview = async (userId, accept, reason) => {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                statusLvl: accept ? 3 : 2,
                deniedMsg: reason,
            }
        });
    } catch (error) {
        console.error('Error in sendVerif:', error);
        return null;
    }
};

module.exports = {
    getApiKeyById,
    verifyApiKey,
    getUserByApiKey,
    newApiKey,
    getAccessLvl,
    setAccessLvl,
    getUserByUsername,
    getUsernameById,
    getUserById,
    getAllUsers,
    createUser,
    updateUserPassword,
    deleteUserById,
    updateProfile,
    sendVerif,
    getUsersPage,
    submitReview,
};