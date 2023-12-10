const errorMsg = require('../utils/error');
const connectionPromise = require('../utils/db').connectionPromise;
module.exports = {
    //此處role_id是提前定義好的 default = 2(user)
    addRoleToUser: async (res, role_id , user_id,connection) => {
        try {
            const addRoleToUserQuery = 'INSERT INTO user_role(role_id, user_id) VALUES(?,?)';
            await connection.execute(addRoleToUserQuery, [role_id,user_id]);
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        }
    },
    checkRole: async (res,user_id)=>{
        const connection = await connectionPromise;
        try {
            const selectQuery = 'SELECT * FROM user_role AS u LEFT JOIN roles AS r ON u.role_id = r.id WHERE u.user_id = ?'
            const [result] = await connection.execute(selectQuery, [user_id]);
            return result;
        } catch (error) {
            console.error(error);
            errorMsg.query(res)
        } finally {
            console.log('connection release');
        }
    }
}