// modelTraining.js
async function trainModel(model, userInputs, articleInputs, categoryInputs, ys, epochs, batchSize) {
    await model.fit([userInputs, articleInputs, categoryInputs], ys, {
        epochs: epochs,
        batchSize: batchSize,
        validationSplit: 0.2
    });
}

module.exports = { trainModel };
