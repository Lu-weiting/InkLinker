const categoryService = require('../Service/categoryService');
const redis = require('./cache');
async function createOneHotEncoder() {
    const categoryRedisKey = 'allCategory';
    let cacheObj = await redis.getCacheByKey(categoryRedisKey);
    if(cacheObj == null){
        cacheObj = await categoryService.getAll();
    }
    console.log(cacheObj);
    return function encodeCategory(category) {
        return cacheObj.map(c => c === category ? 1 : 0);
    };
}

module.exports = { createOneHotEncoder };