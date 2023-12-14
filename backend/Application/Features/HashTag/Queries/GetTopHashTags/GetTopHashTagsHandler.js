const errorMsg = require('../../../../../utils/error')
const tool = require('../../../../../utils/tool');
const auth = require('../../../../../utils/auth');
const redis = require('../../../../../utils/cache');
const hashTagService = require('../../../../../Service/hashTagService');
const getTopHashTagsRes = require('./GetTopHashTagsRes');
module.exports = {
    handle: async (res) => {
        //init
        let response = null;
        let topHashTagRedisKey = "topHashTag";

        let result = null;
        let cacheObj = await redis.getCacheByKey(topHashTagRedisKey);
        if(cacheObj === null){
            // 實作Read/Write Through緩存策略 取得同時更新快取
            result = await hashTagService.getTopHashTags(res,topHashTagRedisKey);
        }else{
            result = cacheObj;
        }
        response = await getTopHashTagsRes.customize(res,result);
        return response;
    }
}