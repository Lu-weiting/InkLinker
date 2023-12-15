const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const updatePostRes = require('./UpdatePostRes');
const errorMsg = require('../../../../../utils/error');
module.exports = {
    handle: async (res, data ,my_id) => {
        //init
        let response = null;

        //check 
        if(data.title === null || data.content === null || data.post_id === null){
            return errorMsg.inputEmpty(res);
        }
        //operation
        await postService.updatePost(res,data,my_id);
        

        await updatePostRes.customize(data.post_id);
        return response;
    }
}