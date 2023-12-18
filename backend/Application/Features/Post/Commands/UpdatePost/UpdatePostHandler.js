const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const updatePostRes = require('./UpdatePostRes');
const errorMsg = require('../../../../../utils/error');
const redis = require('../../../../../utils/cache');
module.exports = {
    handle: async (res, data ,my_id) => {
        //init
        let response = null;

        //check 
        if(data.title === null || data.content === null || data.post_id === null){
            return errorMsg.inputEmpty(res);
        }
        //operation
        const postRedisKey = `postDetail&${data.post_id}`;
        let cacheObj = await redis.getCacheByKey(postRedisKey);
        if(cacheObj !== null){
            await redis.deleteCacheByKey(postRedisKey);
        }
        await postService.updatePost(res,data,my_id);
        await updatePostRes.customize(data.post_id);
        return response;
    }
}