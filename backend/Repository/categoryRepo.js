const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const redis = require('../utils/cache');
module.exports = {
    
    getAll: async (res,trainCategoryRedisKey) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
                SELECT DISTINCT id,name
                FROM main_categories
            `;
            const [result] = await connection.execute(selectQuery);
            if (trainCategoryRedisKey != '') {
                await redis.updateCache(trainCategoryRedisKey, result);
            }
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    getCategoryByName: async (res, name) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT *
                FROM main_categories
                WHERE name = ?
            `;
            const [result] = await connection.execute(selectQuery,[name]);
            
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    insertCategory: async(res,name, connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const query = 'INSERT INTO main_categories(name) VALUES(?)';
            const [result] = await connection.execute(query, [name]); 
            return result;     
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
}