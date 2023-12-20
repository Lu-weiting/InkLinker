// const connectionPromise = require('../utils/db').connectionPromise;
const categoryRepo = require('../Repository/categoryRepo');

module.exports = {
    getAll: async (res,trainCategoryRedisKey) => {
        const result = await categoryRepo.getAll(res,trainCategoryRedisKey);
        return result;
    }

}