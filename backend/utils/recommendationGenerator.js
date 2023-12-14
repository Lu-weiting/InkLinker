// recommendationGenerator.js
const tf = require('@tensorflow/tfjs-node');

function generateRecommendationsForUser(userId, model, userIds, articleCount, transformedData, uniqueArticleIds) {
    const userIndex = userIds.get(userId);
    const predictions = [];

    for (let i = 0; i < articleCount; i++) {
        const articleIndex = i;
        const categoryEncoding = transformedData[0].category;
        const prediction = model.predict([tf.tensor2d([[userIndex]]), tf.tensor2d([[articleIndex]]), tf.tensor2d([categoryEncoding])]);
        predictions.push(prediction.dataSync()[0]);
    }

    return predictions
        .map((score, index) => ({ articleId: uniqueArticleIds[index], score }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { generateRecommendationsForUser };
