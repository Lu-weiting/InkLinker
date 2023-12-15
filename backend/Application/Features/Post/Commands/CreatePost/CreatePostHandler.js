const tool = require('../../../../../utils/tool');
const postService = require('../../../../../Service/postService');
const createPostRes = require('./CreatePostRes');
const errorMsg = require('../../../../../utils/error');
module.exports = {
    handle: async (res, data ,my_id) => {
        //init
        let response = null;
        const data_json = JSON.parse(data);

        //check 
        if(data_json.sizes === null || data_json.images === null){
            return errorMsg.inputEmpty(res);
        }
        //operation
        
        const mainImage = uploadedPictures['main_image'][0];
        console.log(mainImage);
        const otherImages = uploadedPictures['other_images'];
        if(!otherImages || !mainImage) return errorMsg.inputEmpty(res);
        
        const mainImageUrl = await tool.uploadToS3(mainImage);
        const otherImageUrls = await Promise.all(otherImages.map(tool.uploadToS3));
        console.log("檔案全部上傳到S3成功");

        const result = await productService.insertNewProduct(res,data_json,mainImageUrl,otherImageUrls);

        response = await createProductResponse.customize(result);
        return response;
    }
}