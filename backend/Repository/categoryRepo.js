const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
// const redis = require('../utils/cache');
module.exports = {
    
    getAll: async (res) => {
        const connection = connectionPromise;
        try {
            const selectQuery = `
                SELECT DISTINCT name
                FROM main_categories
            `;
            const [result] = await connection.execute(selectQuery);
           
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    }
}