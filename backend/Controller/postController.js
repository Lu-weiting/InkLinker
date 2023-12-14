
const getPopularPostHandler = require('../Application/Features/Post/Queries/GetPopularPost/GetPopularPostHandler');
const randomSearchHandler = require('../Application/Features/Post/Queries/RandomSearch/RandomSearchHandler');
const recommandSearchHandler = require('../Application/Features/Post/Queries/RecommandSearch/RecommandSearchHandler');
module.exports = {
    // createPost: async(req, res)=>{
    //     try {
    //         const { data } = req.body;
    //         console.log(data);
    //         const response=await createPostHandler.handle(res,data,uploadedPictures);
    //         res.status(200).json(response);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    getTopPost: async (req, res) => {
        try {
            const { number } = req.query;
            const response = await getPopularPostHandler.handle(res, number);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    },
    randomSearch: async (req, res) => {
        try {
            const my_id = req.decodedToken.id;
            console.log(my_id);
            const { title , cursor } = req.query;
            const result = await randomSearchHandler.handle(res, cursor ? cursor : null ,title ? title : null ,my_id);
            res.status(200).json(result);
        } catch (error) {
            console.log(error)
        }
    },
    recommandSearch: async (req, res) => {
        try {
            const my_id = req.decodedToken.id;
            console.log(my_id);
            const { cursor } = req.query;
            const result = await recommandSearchHandler.handle(res, cursor ? cursor : null ,my_id);

            res.status(200).json(result);
        } catch (error) {
            console.log(error)
        }
    }


}