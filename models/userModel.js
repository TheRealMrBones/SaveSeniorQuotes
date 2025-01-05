const shortid = require('shortid');
const db = require('../util/db');
const prisma = db.prisma;

const generateApiKey = () => shortid();

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

module.exports = {
    getApiKeyById,
    verifyApiKey,
    getUserByApiKey,
    newApiKey,
    getUserByUsername,
    getUsernameById,
    getUserById,
    getAllUsers,
    createUser,
    updateUserPassword,
    deleteUserById,
};