const connectionPromise = require('../utils/db').connectionPromise;
const mlModelRepo = require('../Repository/mlModelRepo');
const errorMsg = require('../utils/error');
const createOneHotEncoder = require('../utils/categoryEncoder');
// const connectionPromise = require('../utils/db').connectionPromise;
module.exports = {
    getCurrentUpdateCount: async (res) => {
        const result = await mlModelRepo.getCurrentUpdateCount(res);
        return result;
    },
    setCurrentUpdateCount: async (res,count) => {
        const connection = await connectionPromise.getConnection();
        try {
            //transaction 
            await connection.beginTransaction();
            await mlModelRepo.setCurrentUpdateCount(res,count,connection);
            await connection.commit();

        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
        return result;
    },
    getTrainModelData: async (res, trainDataRediskey) => {
        const result = await mlModelRepo.getTrainModelData(res,trainDataRediskey);
        return result;
    },

}