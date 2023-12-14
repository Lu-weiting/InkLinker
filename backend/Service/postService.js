const connectionPromise = require('../utils/db').connectionPromise;
const postRepo = require('../Repository/postRepo');
// const tool = require('../utils/tool');
module.exports = {
    getTopPosts: async (res, number,postRedisKey) => {
        const result = await postRepo.getTopPosts(res, number, postRedisKey);
        if (result.length == 0) return res.status(403).json("product doesn't exist");
        return result;
    },
    searchInRandom: async (res, decodeCurser , title , limit) => {
        
        if(title == null){
            const result = await postRepo.searchByNoCondition(res, decodeCurser ,limit);
            return result;
        }
        const result = await postRepo.searchPostByTitle(res,title,decodeCurser , limit);

        return result;
    },
    searchInRecommand: async (res, userRecommendations ,recommandRedisKey,decodeCurser , limit) => {
        
        const result = await postRepo.searchPostByRecommand(res,userRecommendations, recommandRedisKey,decodeCurser , limit);

        return result;
    },


}