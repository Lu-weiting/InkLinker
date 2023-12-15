
const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
// const redis = require('../utils/cache');
module.exports = {
    insertPic: async(res,data, connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const query = 'INSERT INTO post_images(img_url,post_id) VALUES(?,?)';
            const [result] = await connection.execute(query, [data.mainImg, data.post_id]); 
            return result;     
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    }
}
    