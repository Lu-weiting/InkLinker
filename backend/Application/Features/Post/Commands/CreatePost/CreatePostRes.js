module.exports = {
    customize: async(result)=>{
        const productId = result.insertId;
        const response = {
            data: {
                product: productId
            }
        };
        return response;
    }
}