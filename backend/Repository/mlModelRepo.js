
const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const redis = require('../utils/cache');
module.exports = {
    
    getCurrentUpdateCount: async (res) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT id , update_point
                FROM tensorflow_model
            `;
            const [result] = await connection.execute(selectQuery);
           
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    // a new post or new user
    setCurrentUpdateCount: async (res,count ,connection) => {
        try {
            //因為只有一筆
            const query = `
                UPDATE tensorflow_model
                SET update_point = ?
            `;
            await connection.execute(query,[count]);
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    getTrainModelData: async (res,trainDataRediskey) => {
        const connection = connectionPromise;
        try {

            const selectQuery = `
                SELECT 
                    pl.user_id,
                    pl.post_id,
                    c.name AS category,
                    IF(pl.post_id IS NOT NULL, 1, 0) AS \`like\`
                FROM 
                    users u
                CROSS JOIN 
                    posts p
                LEFT JOIN 
                    post_like pl ON u.id = pl.user_id AND p.id = pl.post_id
                LEFT JOIN 
                    main_categories c ON p.main_category_id = c.id
            `;     
            const [result] = await connection.execute(selectQuery);
            if (trainDataRediskey != '') {
                await redis.updateCache(trainDataRediskey, result);
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