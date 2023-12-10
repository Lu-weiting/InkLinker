const userSignUpHandler = require('../Application/Features/User/Commands/UserSignUp/UserSignUpHandler');
const userSignInHandler = require('../Application/Features/User/Commands/UserSignIn/UserSignInHandler');
// const getUserProfileHandler = require('../Application/Features/UserInfo/Queries/GetUserProfile/getUserProfileHandler');

module.exports = {
    signUp: async(req,res)=>{
        try {
            const { name , email , password} = req.body;
            const response=await userSignUpHandler.handle(res, name , email , password);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    },
    signIn: async(req,res)=>{
        try {
            const { provider , email , password } = req.body;
            const response=await userSignInHandler.handle(res, provider , email , password);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    }
    // getProfile: async(req,res)=>{
    //     try {
    //         const loginUserId = req.decodedToken.id;
    //         const response=await getUserProfileHandler.handle(res, loginUserId);
    //         res.status(200).json(response);
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }

}