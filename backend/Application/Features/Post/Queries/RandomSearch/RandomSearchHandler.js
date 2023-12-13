const errorMsg = require('../../../../../utils/error')
const tool = require('../../../../../utils/tool');
// const auth = require('../../../../../utils/auth');
// const redis = require('../../../../../utils/cache');
const postService = require('../../../../../Service/postService');
const randomSearchRes = require('./RandomSearchRes');
module.exports = {
    handle: async (res, cursor, title, user_id) => {
        //init
        let response = null;

        const limit = 6;
        let decodeCurser = 0;
        if (cursor == null) {
            decodeCurser = Math.pow(2, 64);
        } else {
            decodeCurser = await tool.decryptCursor(cursor);
        }
        const searchResult = await postService.searchInRandom(res, decodeCurser, title ,limit)
        
        response = randomSearchRes.customize(res,searchResult,limit);
        return response;
    }
}