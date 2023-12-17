const createPostHandler = require('../Application/Features/Post/Commands/CreatePost/CreatePostHandler');
const updatePostHandler = require('../Application/Features/Post/Commands/UpdatePost/UpdatePostHandler');
const getPopularPostHandler = require('../Application/Features/Post/Queries/GetPopularPost/GetPopularPostHandler');
const randomSearchHandler = require('../Application/Features/Post/Queries/RandomSearch/RandomSearchHandler');
const recommandSearchHandler = require('../Application/Features/Post/Queries/RecommandSearch/RecommandSearchHandler');
const likePostHandler = require('../Application/Features/Post/Commands/LikePost/LikePostHandler');
const cancelLikeHandler = require('../Application/Features/Post/Commands/CancelLikePost/CancelLikePostHandler');
const getPostDetailHandler = require('../Application/Features/Post/Queries/GetPostDetail/GetPostDetailHandler');
module.exports = {
    createPost: async(req, res)=>{
        try {
            const { title,content } = req.body;
            const my_id = req.decodedToken.id;
            console.log(title);
            const data = {
                title: title,
                content: content
            }
            const response=await createPostHandler.handle(res,data,my_id);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    },
    updatePost: async(req, res)=>{
        try {
            const { title,  content, tags, mainImg, post_id} = req.body;
            const my_id = req.decodedToken.id;
            const data = {
                title: title,
                content: content,
                tags: tags,
                mainImg: mainImg,
                post_id: post_id
            };
            console.log(data);
            console.log(data.tags[0]);
            const response=await updatePostHandler.handle(res,data,my_id);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    },
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
    },
    getPostDetail: async (req, res) => {
        try {
            const pid = parseInt(req.params.id);
            const my_id = req.decodedToken.id;
            const response = await getPostDetailHandler.handle(res, pid, my_id);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    },
    postLike: async (req,res)=>{
        try{
            const pid =parseInt(req.params.id);
            const my_id = req.decodedToken.id;
            await likePostHandler.handle(res,pid,my_id);
        } catch (error) {
            console.log(error)
        }
    },
    deleteLike: async(req,res)=>{
        try{
            const pid =parseInt(req.params.id);
            const my_id = req.decodedToken.id;
            await cancelLikeHandler.handle(res,pid,my_id);
        } catch (error) {
            console.log(error)
        }
    }


}