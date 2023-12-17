const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const postDetailResponse = require('./GetPostDetailRes');
const redis = require('../../../../../utils/cache');
module.exports = {
    handle: async(res,postId,userId)=>{
        //init
        let response = null;
        const postRedisKey = `postDetail&${productId}`;

        //operation
        let result = null;
        let cacheObj = await redis.getCacheByKey(postRedisKey);
        if(cacheObj === null){
            // 實作Read/Write Through緩存策略 取得同時更新快取
            result = await postService.getPostDetail(res,postId,userId,postRedisKey);
        }else{
            result = cacheObj;
        }
        
        if (result.length == 0) return res.status(403).json("product doesn't exist");
        console.log(result);
        response = await postDetailResponse.customize(result);
        return response
    }

}