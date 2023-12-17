const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const likePostRes = require('./LikePostRes');
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
        await postService.updatePostLike(res,postId,my_id);
        await likePostRes.customize(postId);
        return response;
    }
}