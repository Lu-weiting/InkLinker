// getTopPosts
const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const redis = require('../utils/cache');

module.exports = {
    initPost: async (res, data, userId) => {
        const connection = connectionPromise;
        try {
            const query = `
                INSERT INTO posts(title,content,status,user_id) VALUES (? , ? , ? , ?)
            `;
            const [result] = await connection.execute(query,[data.title,data.content, 'draft',userId]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    updatePost: async(res, data , userId, connection)=>{
        try {
            const {title , content, post_id , tags} = data;
            const query = 'UPDATE posts SET title = ?, content = ?, main_category = ? WHERE user_id = ? AND id = ?';
            await connection.execute(query, [title , content , tags[0], userId , post_id]);      
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
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
                SELECT p.id, p.title , u.id AS uid, u.name AS authorName, u.avatar
                FROM posts p INNER JOIN users u ON p.user_id = u.id
                ORDER BY like_count DESC
                LIMIT ${number}
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
    searchPostByTitle: async (res, title, decodeCurser, limit) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
                SELECT 
                    P.*,
                    U.id AS uid,
                    U.name AS userName,
                    U.avatar AS avatar,
                    (SELECT PI.img_url FROM post_images AS PI WHERE PI.post_id = P.id LIMIT 1) AS image_url
                FROM posts AS P
                LEFT JOIN users AS U ON P.user_id = U.id 
                WHERE P.status = ? AND P.is_active = ? AND P.title LIKE ? AND P.id < ${decodeCurser}
                ORDER BY P.id DESC
                LIMIT ${limit}
            `;

            const [result] = await connection.execute(selectQuery, ['published', 1, `'%${title}%'`, decodeCurser, limit]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    searchByNoCondition: async (res, decodeCurser, limit) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
            SELECT 
                P.*,
                U.id AS uid,
                U.name AS userName,
                U.avatar AS avatar,
                (SELECT PI.img_url FROM post_images AS PI WHERE PI.post_id = P.id LIMIT 1) AS image_url
            FROM posts AS P
            LEFT JOIN users AS U ON P.user_id = U.id
            WHERE (P.status = ?) AND (P.is_active = ?) AND (P.id < ${decodeCurser})
            ORDER BY P.id DESC
            LIMIT ${limit}
            `;
            console.log("solve pro~~~");
            console.log("decodeCurser",decodeCurser);
            console.log("limit",limit);
            const [result] = await connection.execute(selectQuery, ['published', 1]);

            console.log("solve pro2~~~");
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    searchPostByRecommand: async (res, userRecommendations, recommandRedisKey,decodeCurser, limit) => {
        const connection = connectionPromise;
        try {
            let sortedArticleIds = userRecommendations.map(item => item.articleId);
            let startIndex = decodeCurser == Math.pow(2, 64) ? 0 : sortedArticleIds.indexOf(decodeCurser);
            let pagedArticleIds = sortedArticleIds.slice(startIndex, startIndex + limit);

            const selectQuery = `
                SELECT 
                    P.*,
                    U.id AS uid,
                    U.name AS userName,
                    U.avatar AS avatar,
                    (SELECT PI.img_url FROM post_images AS PI WHERE PI.post_id = P.id LIMIT 1) AS image_url
                FROM posts AS P
                LEFT JOIN users AS U ON P.user_id = U.id 
                WHERE P.id IN (?)
                ORDER BY FIELD(P.id, ?)
            `;
            const [result] = await connection.execute(selectQuery, [pagedArticleIds, pagedArticleIds]);
            if (recommandRedisKey != '') {
                await redis.updateCache(recommandRedisKey, result);
            }
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    }




}