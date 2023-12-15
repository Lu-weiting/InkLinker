const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const createPostRes = require('./CreatePostRes');
const errorMsg = require('../../../../../utils/error');
module.exports = {
    handle: async (res, data ,my_id) => {
        //init
        let response = null;

        //check 
        if(data.title === null || data.content === null){
            return errorMsg.inputEmpty(res);
        }
        //operation

        const result = await postService.initPost(res,data,my_id);
        

        response = await createPostRes.customize(result);
        return response;
    }
}