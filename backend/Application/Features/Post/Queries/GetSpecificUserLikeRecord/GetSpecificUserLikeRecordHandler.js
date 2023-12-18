const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const getSpecificUserLikeRecordResponse = require('./GetSpecificUserLikeRecordRes');
// const redis = require('../../../../../utils/cache');
module.exports = {
    handle: async (res, postId, userId) => {
        //init
        let response = null;

        //operation
        let result = null;
        result = await postService.getSpecificUserLikeRecord(res, postId, userId);

        response = await getSpecificUserLikeRecordResponse.customize(result.length == 0 ? false : true);
        return response
    }

}