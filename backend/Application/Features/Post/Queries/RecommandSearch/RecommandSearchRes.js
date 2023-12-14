const tool = require('../../../../../utils/tool');
module.exports = {
    customize: async (res, recommandSearchResult,limit) => {
        let response = null;
        let resultArray = [];
        let len = recommandSearchResult.length;
        if (recommandSearchResult.length >= limit) len = recommandSearchResult.length - 1;

        if (recommandSearchResult.length != 0) {
            for (let i = 0; i < len; i++) {
                const post = {
                    id: recommandSearchResult[i].id,
                    title: recommandSearchResult[i].title,
                    content: recommandSearchResult[i].content,
                    main_category: recommandSearchResult[i].main_category,
                    img_url: searchResult[i].image_url,
                    created_at: recommandSearchResult[i].created_at,
                    author: {
                        id: recommandSearchResult[i].uid,
                        name: recommandSearchResult[i].userName,
                        avator: recommandSearchResult[i].avator
                    }
                }
                resultArray.push(post);
            }
        }
        const cusr = recommandSearchResult.length < limit ? null : String(recommandSearchResult[recommandSearchResult.length - 2].id);
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