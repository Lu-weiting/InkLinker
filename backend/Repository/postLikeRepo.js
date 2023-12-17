const errorMsg = require('../utils/error');
const connectionPromise = require('../utils/db').connectionPromise;
module.exports = {
    //此處role_id是提前定義好的 default = 2(user)
    addLikeRecord: async (res, postId , userId,connection) => {
        try {
            const query = 'INSERT INTO post_like(post_id, user_id) VALUES(?,?)';
            await connection.execute(query, [postId,userId]);
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        }
    },
    findLikeRecord: async (res, postId , userId) =>{
        const connection = await connectionPromise;
        try {
            const selectQuery = 'SELECT * FROM post_like WHERE user_id = ? AND post_id = ?';
            const [result] = await connection.execute(selectQuery, [userId,postId]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    },
    deleteLikeRecord: async (res, postId , userId, connection) =>{
        try {
            const selectQuery = 'DELETE FROM post_like WHERE user_id = ? AND post_id = ?';
            await connection.execute(selectQuery, [userId,postId]);
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        }
    }
    
}