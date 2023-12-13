const connectionPromise = require('../utils/db').connectionPromise;
const hashTagRepo = require('../Repository/hashTagRepo');

module.exports = {
    getTopHashTags: async (res,hashTagRedisKey) => {
        const result = await hashTagRepo.getTopHashTags(res, hashTagRedisKey);
        return result;
    },

}