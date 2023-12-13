
module.exports = {
    customize: async (res, result) => {
        let response = null;
        const totalData = [];
        for (let i = 0; i < result.length; i++) {
            let res = {
                id: result[i].id,
                title: result[i].title,
                author: {
                    id: result[i].uid,
                    name: result[i].authorName,
                    avator: result[i].avator
                }
            };
            totalData.push(res);
        }
        response = {
            data: {
                posts: totalData
            }
        };
        return response;
    }
}