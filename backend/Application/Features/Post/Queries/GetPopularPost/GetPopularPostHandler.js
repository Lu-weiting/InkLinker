const errorMsg = require('../../../../../utils/error')
const tool = require('../../../../../utils/tool');
const auth = require('../../../../../utils/auth');
const redis = require('../../../../../utils/cache');
const postService = require('../../../../../Service/postService');
const getPopularPostRes = require('./GetPopularPostRes');
module.exports = {
    handle: async (res, number) => {
        //init
        let response = null;
        let topPostRedisKey = "topPost";

        let result = null;
        let cacheObj = await redis.getCacheByKey(topPostRedisKey);
        if(cacheObj === null){
            // 實作Read/Write Through緩存策略 取得同時更新快取
            result = await postService.getTopPosts(res, number ? number : 3, topPostRedisKey);
        }else{
            result = cacheObj;
        }
        response = await getPopularPostRes.customize(res,result);
        return response;
    }
}