// modelDefinition.js
const tf = require('@tensorflow/tfjs-node');

function createModel(userCount, articleCount, categoryCount, embeddingSize) {
    const userInput = tf.input({shape: [1]});
    const userEmbedding = tf.layers.embedding({inputDim: userCount, outputDim: embeddingSize}).apply(userInput);

    const articleInput = tf.input({shape: [1]});
    const articleEmbedding = tf.layers.embedding({inputDim: articleCount, outputDim: embeddingSize}).apply(articleInput);

    const categoryInput = tf.input({shape: [categoryCount]});
    const categoryDense = tf.layers.dense({units: embeddingSize, activation: 'relu'}).apply(categoryInput);

    const concatenated = tf.layers.concatenate().apply([tf.layers.flatten().apply(userEmbedding), tf.layers.flatten().apply(articleEmbedding), categoryDense]);

    const dense1 = tf.layers.dense({units: 128, activation: 'relu'}).apply(concatenated);
    const output = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(dense1);

    const model = tf.model({inputs: [userInput, articleInput, categoryInput], outputs: output});
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

module.exports = { createModel };
