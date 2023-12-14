const tool = require('../../../../../utils/tool');
module.exports = {
    customize: async (res, searchResult,limit) => {
        let response = null;
        let resultArray = [];
        let len = searchResult.length;
        if (searchResult.length >= limit) len = searchResult.length - 1;

        if (searchResult.length != 0) {
            for (let i = 0; i < len; i++) {
                const post = {
                    id: searchResult[i].id,
                    title: searchResult[i].title,
                    content: searchResult[i].content,
                    main_category: searchResult[i].main_category,
                    created_at: searchResult[i].created_at,
                    img_url: searchResult[i].image_url,
                    author: {
                        id: searchResult[i].uid,
                        name: searchResult[i].userName,
                        avatar: searchResult[i].avatar
                    }
                }
                resultArray.push(post);
            }
        }
        const cusr = searchResult.length < limit ? null : String(searchResult[searchResult.length - 2].id);
        // const cusr = String(result[result.length - 2].id);
        let next_cursor = null;
        if (cusr != null) {
            next_cursor = await tool.encryptCursor(cusr);
            next_cursor = encodeURIComponent(next_cursor);
        }
        response = {
            data: {
                posts: resultArray,
                next_cursor: next_cursor
            }
        };
        return response;
    }
}