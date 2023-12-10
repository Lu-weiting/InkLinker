const userRepo = require('../Repository/userRepo');
const roleRepo = require('../Repository/roleRepo');
const errorMsg = require('../utils/error');
const connectionPromise = require('../utils/db').connectionPromise;
module.exports = {
    signUp: async (res, userIfoObj) => {
        const connection = await connectionPromise.getConnection();
        try {
            //transaction 
            const checkResult = await userRepo.selectUserByEmail(res, userIfoObj.email);
            if (checkResult.length > 0) {
                return errorMsg.emailExist(res);
            }

            await connection.beginTransaction();
            const insertResult = await userRepo.insertNewUser(res, userIfoObj, connection);
            await roleRepo.addRoleToUser(res, 2 , insertResult.insertId , connection);
            await connection.commit();

            return insertResult;

        } catch (error) {
            await connection.rollback();
            console.error(error);
            errorMsg.query(res);
        } finally {
            console.log('connection release');
            connection.release();
        }

    },
    signIn: async (res, email) => {
        const result = await userRepo.selectUserByEmail(res, email);
        // if (result.length === 0) {
        //     return errorMsg.noUser(res);
        // }
        return result;
    },
    getProfile: async (res, userId) => {
        const result = await userRepo.selectUserById(res, userId);
        if (result.length === 0) {
            return errorMsg.noUser(res);
        }
        return result;
    }
}