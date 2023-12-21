const errorMsg = require('../../../../../utils/error');
const tool = require('../../../../../utils/tool');
const auth = require('../../../../../utils/auth');

const userService = require('../../../../../Service/userService');
const userSignUpRes = require('./UserSignUpRes');
module.exports = {
    handle: async (res, name , email , password) => {
        //init
        let provider = "native";
        let response = null;

        //check
        if (!name || !email || !password) return errorMsg.inputEmpty(res);
        if (!await tool.checkEmail(email)) {
            return error.emailFormat(res);
        }
        //operation
        const hashedPassword = await tool.generateHashPassword(password);
        const userInfoObj = {
            name: name,
            email: email,
            hashedPassword: hashedPassword,
            provider: provider,
            avatar: null
        };
        console.log(userInfoObj);
        const insertResult = await userService.signUp(res,userInfoObj);
        if(!insertResult) return errorMsg.emailExist(res);
        const accessTokenInfoObj = await auth.generateAccessToken(insertResult.insertId);
        response = await userSignUpRes.customize(insertResult,userInfoObj,accessTokenInfoObj);
        return response;
    }
}