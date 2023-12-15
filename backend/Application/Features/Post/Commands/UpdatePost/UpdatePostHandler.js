const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const createPostRes = require('./UpdatePostRes');
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
        const result = await postService.updatePost(res,data,my_id);
        

        response = await createPostRes.customize(result);
        return response;
    }
}