
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
    getTopHashTags: async (res, hashTagRedisKey) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT id , name
                FROM hash_tags
                ORDER BY mapping_count DESC
                LIMIT 6;
            `;
            const [result] = await connection.execute(selectQuery);
            if (hashTagRedisKey != '') {
                await redis.updateCache(hashTagRedisKey, result);
            }
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    getHashTagByName: async (res, name) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT *
                FROM hash_tags
                WHERE name = ?
            `;
            console.log(name);
            const [result] = await connection.execute(selectQuery,[name]);
            
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    insertHashTag: async(res,name, connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const query = 'INSERT INTO hash_tags(name) VALUES(?)';
            const [result] = await connection.execute(query, [name]); 
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
    insertPostHashTag: async(res,post_id,tag_id, connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const query = 'INSERT INTO post_hash_tags(post_id, hash_tag_id) VALUES(?,?)';
            const [result] = await connection.execute(query, [post_id,tag_id]); 
            return result;     
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
    updateHashTag: async(res, id,connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const query = 'UPDATE hash_tags SET mapping_count = mapping_count+1 WHERE id = ?';
            await connection.execute(query, [id]); 
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    }
    
    


}