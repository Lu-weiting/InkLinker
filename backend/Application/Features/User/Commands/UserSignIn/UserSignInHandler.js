const errorMsg = require('../../../../../utils/error')
const tool = require('../../../../../utils/tool');
const auth = require('../../../../../utils/auth');

const userService = require('../../../../../Service/userService');
const userSignInRes = require('./UserSignInRes');
module.exports = {
    handle: async (res, provider, email, password) => {
        //init
        let response = null;

        // if(provider === "native"){
        //check
        if (!email || !password) return errorMsg.inputEmpty(res);

        //operation
        const getUserdata = await userService.signIn(res, email);
        console.log(getUserdata);
        if (! await tool.confirmPassword(password, getUserdata[0].password)) return errorMsg.wrongPassword(res);
        const accessTokenInfoObj = await auth.generateAccessToken(getUserdata[0].id);
        response = await userSignInRes.customize(getUserdata, accessTokenInfoObj)
        return response;
    }
}