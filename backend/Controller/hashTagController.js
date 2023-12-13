
const getTopHashTagsHandler = require("../Application/Features/")
module.exports = {
    
    getTopHashTags: async(req,res)=>{
        try {
            const {number} = req.query;
            const response = await getTopHashTagsHandler.handle(res,number);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    }


}