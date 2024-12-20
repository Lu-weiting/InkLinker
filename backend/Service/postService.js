const connectionPromise = require('../utils/db').connectionPromise;
const postRepo = require('../Repository/postRepo');
const imageRepo = require('../Repository/imageRepo');
const hashTagRepo = require('../Repository/hashTagRepo');
const categoryRepo = require('../Repository/categoryRepo');
const postLikeRepo = require('../Repository/postLikeRepo');
// const redis = require('../utils/cache');
// const tool = require('../utils/tool');
module.exports = {
    initPost: async (res, data , userId) => {
        const result = await postRepo.initPost(res, data , userId);
        return result;
    },
    updatePost: async (res, data , userId) => {
        const connection = await connectionPromise.getConnection();
        try {
            
            //transaction
            await connection.beginTransaction();
            await postRepo.updatePostStatus(res, data, userId,connection); 
            const category = await categoryRepo.getCategoryByName(res,data.tags[0]);
            if(category.length === 0){
                const insertCategory = await categoryRepo.insertCategory(res,data.tags[0],connection);
                await postRepo.updatePostMainCategory(res,insertCategory.insertId, data.post_id,connection);
            }else{
                await postRepo.updatePostMainCategory(res,category[0].id, data.post_id,connection);
            }
            for(let i = 0 ; i < data.tags.length ; i++){
                let hashTag = await hashTagRepo.getHashTagByName(res,data.tags[i])
                if(hashTag.length !== 0){
                    await hashTagRepo.updateHashTag(res,hashTag[0].id,connection);
                    await hashTagRepo.insertPostHashTag(res,data.post_id,hashTag[0].id,connection);
                }else{
                    const newHashtag = await hashTagRepo.insertHashTag(res,data.tags[i] , connection);
                    await hashTagRepo.insertPostHashTag(res,data.post_id,newHashtag.insertId,connection);
                }
            }
            if(data.mainImg !== null){
                await imageRepo.insertPic(res,data,connection);
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
        let result = null;
        if(title == null){
            result = await postRepo.searchByNoCondition(res, decodeCurser ,limit);
            return result;
        }else{
            result = await postRepo.searchPostByTitle(res,title,decodeCurser , limit);
        }
        console.log("title:",title);
        console.log("titleresult:",result);

        return result;
    },
    searchInRecommand: async (res, userRecommendations ,recommandRedisKey,decodeCurser , limit) => {
        
        const result = await postRepo.searchPostByRecommand(res,userRecommendations, recommandRedisKey,decodeCurser , limit);

        return result;
    },
    getPostDetail: async (res, postId , userId, postRedisKey) => {
        const result = await postRepo.getPostDetail(res, postId , userId, postRedisKey);
        return result;
    },
    getSpecificUserLikeRecord: async (res, postId , userId) => {
        const result = await postRepo.getSpecificUserLikeRecord(res, postId , userId);
        return result;
    },
    updatePostLike: async (res, postId , userId)=>{
        const connection = await connectionPromise.getConnection();
        try {
            //transaction
            const record = await postLikeRepo.findLikeRecord(res,postId,userId);
            await connection.beginTransaction();
            if(record.length === 0){
                await postRepo.likePost(res, postId ,connection);
                await postLikeRepo.addLikeRecord(res,postId,userId,connection);
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
    deletePostLike: async (res, postId , userId)=>{
        const connection = await connectionPromise.getConnection();
        try {
            //transaction
            const record = await postLikeRepo.findLikeRecord(res,postId,userId);
            await connection.beginTransaction();
            if(record.length !== 0){
                await postRepo.deleteLike(res, postId ,connection);
                await postLikeRepo.deleteLikeRecord(res,postId,userId,connection);
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
        
    }


}