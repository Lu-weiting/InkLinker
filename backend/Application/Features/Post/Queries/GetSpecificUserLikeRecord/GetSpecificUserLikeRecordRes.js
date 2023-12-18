module.exports = {
    customize: async (result) => {
        let response = null;
        response = {
            data: {
                is_like: result
            }
        }
        return response;
    }
}