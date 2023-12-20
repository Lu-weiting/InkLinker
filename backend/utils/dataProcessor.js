// dataProcessor.js
const tf = require('@tensorflow/tfjs-node');
function createIndexMappings(queryResults) {
    const uniqueUserIds = Array.from(new Set(queryResults.map(item => item.user_id)));
    const uniqueArticleIds = Array.from(new Set(queryResults.map(item => item.post_id)));
    const userIds = new Map(uniqueUserIds.map((id, index) => [id, index]));
    const articleIds = new Map(uniqueArticleIds.map((id, index) => [id, index]));
    console.log("Indexmap User:",userIds);
    console.log("Indexmap post:",articleIds);

    return { userIds, articleIds, uniqueUserIds, uniqueArticleIds };
}

function transformData(queryResults, userIds, articleIds) {
    return queryResults.map(item => ({
        userIdIndex: userIds.get(item.user_id),
        articleIdIndex: articleIds.get(item.post_id),
        category: item.category,
        like: item.like
    }));
}

function prepareTrainingData(transformedData) {
    const userInputs = tf.tensor2d(transformedData.map(d => [d.userIdIndex]), [transformedData.length, 1]);
    const articleInputs = tf.tensor2d(transformedData.map(d => [d.articleIdIndex]), [transformedData.length, 1]);
    const categoryInputs = tf.tensor2d(transformedData.map(d => d.category), [transformedData.length, transformedData[0].category.length]);
    const ys = tf.tensor2d(transformedData.map(d => [d.like]), [transformedData.length, 1]);
    console.log('after prepareTrainingData~~');
    return { userInputs, articleInputs, categoryInputs, ys };
}


module.exports = { createIndexMappings, transformData , prepareTrainingData};
