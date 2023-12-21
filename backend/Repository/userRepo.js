// const tool = require('../utils/tool');
const errorMsg = require('../utils/error');
const connectionPromise = require('../utils/db').connectionPromise;
module.exports = {
    selectUserByEmail: async(res,email)=>{
        const connection = connectionPromise;
        try {
            const [result] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
    selectUserById: async(res,userId)=>{
        const connection = connectionPromise;
        try {
            const [result] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    },
    insertNewUser: async(res,userInfoObj, connection)=>{
        try {
            const {name , email, hashedPassword , provider , avatar} = userInfoObj;
            const signupQuery = 'INSERT INTO users(name, email, password, provider , avatar , isActive) VALUES(?,?,?,?,?,?)';
            const [result] = await connection.execute(signupQuery, [name, email, hashedPassword, provider , avatar , 1]); 
            return result;     
        } catch (error) {
            console.error(error);
            errorMsg.query(res);
        }
    }
}