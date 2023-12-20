const tf = require('@tensorflow/tfjs-node');
const errorMsg = require('../../../../../utils/error')
const tool = require('../../../../../utils/tool');
// const auth = require('../../../../../utils/auth');
const redis = require('../../../../../utils/cache');
const postService = require('../../../../../Service/postService');
const mlModelService = require('../../../../../Service/mlModelService');
const categoryService = require('../../../../../Service/categoryService');

const dataProcessor = require('../../../../../utils/dataProcessor');
const modelDefinition = require('../../../../../utils/modelDefinition');
const modelTraining = require('../../../../../utils/modelTraining');
const recommendationGenerator = require('../../../../../utils/recommendationGenerator');
const {createOneHotEncoder} = require('../../../../../utils/categoryEncoder');

const recommandSearchRes = require('./RecommandSearchRes');
module.exports = {
    handle: async (res, cursor, userId) => {
        //init
        let response = null;

        const limit = 6;
        let decodeCurser = 0;
        if (cursor == null) {
            decodeCurser = Math.pow(2, 64);
        } else {
            decodeCurser = await tool.decryptCursor(cursor);
        }
        const categoryRedisKey = "allCategory";
        const trainningRedisKey = "trainningQueryResult";
        const predictParamRedisKey = "predictParam";
        const recommandResultForSpecificUserRedisKey = `recommandResult&${userId}`
        const recommandResultForSpecificUser = await redis.getCacheByKey(recommandResultForSpecificUserRedisKey);
        if(recommandResultForSpecificUser != null)
        {
            response = await recommandSearchRes.customize(res,recommandResultForSpecificUser,limit);
            return response;
        }
        try {
            
            // 尝试加载模型
            const model = await tf.loadLayersModel('file:///app/model/myModel/model.json');
            console.log("模型加载成功");
            const predictParam = await redis.getCacheByKey(predictParamRedisKey);
            console.log(predictParam);
            const userRecommendations = recommendationGenerator.generateRecommendationsForUser(userId, model, predictParam.userIds, predictParam.articleCount, predictParam.transformedData, predictParam.uniqueArticleIds);
            const recommandResult = await postService.searchInRecommand(res,userRecommendations,recommandResultForSpecificUserRedisKey , decodeCurser,limit);
            response = await recommandSearchRes.customize(res,recommandResult,limit);

            return response;
        } catch (error) {
            console.log("加载模型失败，开始训练新模型");
            
            //TODO: fetch
            const trainningDataRedis = await redis.getCacheByKey(trainningRedisKey);
            let queryResults = null;
            if(trainningDataRedis != null){
                queryResults = trainningDataRedis;
            }else{
                const encodeCategory = await createOneHotEncoder();
                const trainModelData = await mlModelService.getTrainModelData(res,trainningRedisKey);
                // console.log("transformedData:",trainModelData);
                const tData = trainModelData.map(item => {
                    return {
                        ...item,
                        category: encodeCategory(item.category)
                    };
                });
                console.log("transformedData:",tData);
                queryResults = tData;
            }
            // 数据处理
            const { userIds, articleIds, uniqueUserIds, uniqueArticleIds } = dataProcessor.createIndexMappings(queryResults);
            const transformedData = dataProcessor.transformData(queryResults, userIds, articleIds);
            console.log("prepareTrainingData before:",transformedData);
            const { userInputs, articleInputs, categoryInputs, ys } = dataProcessor.prepareTrainingData(transformedData);
            const userCount = uniqueUserIds.length;
            const articleCount = uniqueArticleIds.length;
            // const categoryCount = transformedData[0].category.length;
            const allCategoryRedis = await redis.getCacheByKey(categoryRedisKey);
            // const categoryEntityLength = await categoryService.getAll(res,allCategoryRedis).length;
            // console.log("categoryEntityLength",categoryEntityLength);
            const categoryCount = allCategoryRedis == null ? await categoryService.getAll(res,allCategoryRedis).length : allCategoryRedis.length;
            const embeddingSize = 50;

            // 创建模型
            console.log("start model create");
            const model = modelDefinition.createModel(userCount, articleCount, categoryCount, embeddingSize);
            console.log("start train");
            // 训练模型
            await modelTraining.trainModel(model, userInputs, articleInputs, categoryInputs, ys, 20, 32);

            const userRecommendations = recommendationGenerator.generateRecommendationsForUser(userId, model, userIds, articleCount, transformedData, uniqueArticleIds);
            const predictParam = {
                userIds: userIds,
                articleCount: articleCount,
                transformedData: transformedData,
                uniqueArticleIds: uniqueArticleIds
            };
            await redis.updateCache(predictParamRedisKey,predictParam);
            const recommandResult = await postService.searchInRecommand(res,userRecommendations,recommandResultForSpecificUserRedisKey , decodeCurser,limit);
            response = await recommandSearchRes.customize(res,recommandResult,limit);
            // 保存新训练的模型
            await model.save('file:///app/model/myModel');
            return response;
        }

        // const modelCurrentUpdateCount = await mlModelService.getCurrentUpdateCount(res);
        // console.log("modelCurrentUpdateCount: ", modelCurrentUpdateCount);
        // // > 1則重新訓練model
        // if (modelCurrentUpdateCount > 1) {

        // }
    }
}