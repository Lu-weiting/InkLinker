const roleRepo = require('../Repository/roleRepo');

module.exports = {
    checkRole: async (res,user_id)=>{
        return roleRepo.checkRole(res,user_id);
    }
}