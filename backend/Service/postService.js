const connectionPromise = require('../utils/db').connectionPromise;
const postRepo = require('../Repository/postRepo');
const imageRepo = require('../Repository/imageRepo');
const hashTagRepo = require('../Repository/hashTagRepo');
const categoryRepo = require('../Repository/categoryRepo');

// const tool = require('../utils/tool');
module.exports = {
    initPost: async (res, data , userId) => {
        const result = await postRepo.initPost(res, data , userId);
        return result;
    },
    updatePost: async (res, data , userId) => {
        const connection = await connectionPromise.getConnection();
        try {
            await connection.beginTransaction();
            await postRepo.updatePost(res, data, userId,connection);
            //transaction 
            for(let i = 0 ; i < data.tags.length ; i++){
                let hashTag = await hashTagRepo.getHashTagByName(data.tags[i])
                if(hashTag.length === 0){
                    await hashTagRepo.updateHashTag(res,hashTag[0].id,connection);
                    await hashTagRepo.insertPostHashTag(res,data.post_id,hashTag[0].id,connection);
                }else{
                    const newHashtag = await hashTagRepo.insertHashTag(res,data.tags[i] , connection);
                    await hashTagRepo.insertPostHashTag(res,data.post_id,newHashtag.insertId,connection);
                }
            }
            await imageRepo.insertPic(res,data,connection);
            const category = await categoryRepo.getCategoryByName(res,data.tags[0]);
            if(category.length === 0){
                await categoryRepo.insertCategory(res,data.tags[0],connection);
            }
            await connection.commit();

        } catch (error) {
            await connection.rollback();
            console.error(error);
            errorMsg.query(res);
        } finally {
            console.log('connection release');
            connection.release();
        }
    },
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