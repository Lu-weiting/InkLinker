
module.exports = {
    customize: async (res, result) => {
        let response = null;
        const totalData = [];
        for (let i = 0; i < result.length; i++) {
            let res = {
                id: result[i].id,
                name: result[i].name,
            };
            totalData.push(res);
        }
        response = {
            data: {
                hashtags: totalData
            }
        };
        return response;
    }
}