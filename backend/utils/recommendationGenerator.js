// recommendationGenerator.js
const tf = require('@tensorflow/tfjs-node');

function generateRecommendationsForUser(userId, model, userIds, articleCount, transformedData, uniqueArticleIds) {
    const userIndex = userIds.get(userId);
    const predictions = [];

    for (let i = 0; i < articleCount; i++) {
        const articleIndex = i;
        const articleData = transformedData.find(data => data.articleIdIndex === articleIndex);
        const categoryEncoding = articleData ? articleData.category : transformedData[0].category; // 如果沒有找到，使用預設值
        const prediction = model.predict([tf.tensor2d([[userIndex]]), tf.tensor2d([[articleIndex]]), tf.tensor2d([categoryEncoding])]);
        predictions.push(prediction.dataSync()[0]);
    }

    return predictions
        .map((score, index) => ({ articleId: uniqueArticleIds[index], score }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { generateRecommendationsForUser };
