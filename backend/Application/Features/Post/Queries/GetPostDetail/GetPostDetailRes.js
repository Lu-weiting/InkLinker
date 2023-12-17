
module.exports = {
    customize: async (result) => {
        let response = null;
        const totalData = {
            id: result[0].id,
            title: result[0].title,
            content: result[0].content,
            like_count: result[0].like_count,
            created_at: result[0].created_at,
            tags: result[0].hash_tag_names ? result[0].hash_tag_names.split(',') : [],
            author: {
                id: result[0].author_id,
                name: result[0].author_name,
                avatar: result[0].author_avatar
            },
            is_like: result[0].is_like
        };
        response = {
            data: totalData
        }
        return response;
    }
}