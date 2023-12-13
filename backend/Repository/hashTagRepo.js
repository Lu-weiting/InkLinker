
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
    }
    
    


}