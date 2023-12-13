// getTopPosts
const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const redis = require('../utils/cache');

module.exports = {
    /**
     * Implement Read/Write Through strategy
     * @param {Object} res - The obj response for client
     * @param {string} postRedisKey -The key of post redis
     * @returns {Array || error}
     */
    getTopPosts: async (res, number, postRedisKey) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT p.id, p.title , u.id AS uid, u.name AS authorName, u.avator
                FROM posts p INNER JOIN users u ON p.user_id = u.id
                ORDER BY like_count DESC
                LIMIT ${number};
            `;
            const [result] = await connection.execute(selectQuery);
            if (postRedisKey != '') {
                await redis.updateCache(postRedisKey, result);
            }
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    searchPostByTitle: async (res, title, decodeCurser , limit) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
                SELECT 
                    P.*,
                    U.id AS uid,
                    U.name AS userName,
                    U.avator AS avator
                FROM posts AS P
                LEFT JOIN users AS U ON P.user_id = U.id 
                WHERE P.status = ? AND P.is_active = ? AND P.title LIKE ? AND P.id < ?
                ORDER BY P.id DESC
                LIMIT ?
            `;

            const [result] = await connection.execute(selectQuery,['published',1,`%${title}%`,decodeCurser,limit]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    searchByNoCondition: async (res, decodeCurser , limit) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
                SELECT 
                    P.*,
                    U.id AS uid,
                    U.name AS userName,
                    U.avator AS avator
                FROM posts AS P
                LEFT JOIN users AS U ON P.user_id = U.id 
                WHERE P.status = ? AND P.is_active = ? AND P.id < ?
                ORDER BY P.id DESC
                LIMIT ?
            `;
            const [result] = await connection.execute(selectQuery,['published',1,decodeCurser,limit]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    }
    
    


}