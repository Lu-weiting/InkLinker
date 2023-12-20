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
    // const dense1 = tf.layers.dense({units: 128, activation: 'relu'}).apply(concatenated);
    // const output = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(dense1);
    
    const dense1 = tf.layers.dense({units: 128, activation: 'relu'}).apply(concatenated);
    const dropout = tf.layers.dropout({rate: 0.5}).apply(dense1); // 添加 Dropout 层
    const dense2 = tf.layers.dense({units: 64, activation: 'relu'}).apply(dropout); // 添加额外的 Dense 层
    const output = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(dense2);

    

    const model = tf.model({inputs: [userInput, articleInput, categoryInput], outputs: output});
    const optimizer = tf.train.adam(0.001);
    model.compile({
        optimizer: optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

module.exports = { createModel };
