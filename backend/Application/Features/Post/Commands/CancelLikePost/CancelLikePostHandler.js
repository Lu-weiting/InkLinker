const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const cancelLikePostRes = require('./CancelLikePostRes');
const errorMsg = require('../../../../../utils/error');
module.exports = {
    handle: async (res,postId,my_id) => {
        //init
        let response = null;

        //check 
        if(postId === null || my_id === null){
            return errorMsg.inputEmpty(res);
        }
        //operation
        await postService.deletePostLike(res,postId,my_id);
        await cancelLikePostRes.customize(postId);
        return response;
    }
}