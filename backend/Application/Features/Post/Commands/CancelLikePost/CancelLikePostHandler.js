const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const cancelLikePostRes = require('./CancelLikePostRes');
const errorMsg = require('../../../../../utils/error');
const redis = require('../../../../../utils/cache');
module.exports = {
    handle: async (res,postId,my_id) => {
        //init
        let response = null;

        //check 
        if(postId === null || my_id === null){
            return errorMsg.inputEmpty(res);
        }
        //operation
        const postRedisKey = `postDetail&${postId}`;
        let cacheObj = await redis.getCacheByKey(postRedisKey);
        if(cacheObj !== null){
            await redis.deleteCacheByKey(postRedisKey);
        }
        await postService.deletePostLike(res,postId,my_id);
        await cancelLikePostRes.customize(postId);
        return response;
    }
}