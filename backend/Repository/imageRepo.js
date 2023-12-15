
const connectionPromise = require('../utils/db').connectionPromise;
// const sql_view = require('../utils/sql_view');
// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const redis = require('../utils/cache');
module.exports = {
    insertPic: async(res,pic, connection)=>{
        try {
            // const {name , email, hashedPassword , provider , avator} = userInfoObj;
            const signupQuery = 'INSERT INTO post_images(name, email, password, provider , avatar , isActive) VALUES(?,?,?,?,?,?)';
            const [result] = await connection.execute(signupQuery, [name, email, hashedPassword, provider , avator , 1]); 
            return result;     
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    }
}
    