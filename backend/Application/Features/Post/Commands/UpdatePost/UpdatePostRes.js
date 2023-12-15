module.exports = {
    customize: async(result)=>{
        const postId = result.insertId;
        const response = {
            data: {
                post_id: postId
            }
        };
        return response;
    }
}