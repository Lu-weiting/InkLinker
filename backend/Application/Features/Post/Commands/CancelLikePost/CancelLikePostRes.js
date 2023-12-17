module.exports = {
    customize: async(result)=>{
        
        const response = {
            data: {
                post_id: result
            }
        };
        return response;
    }
}