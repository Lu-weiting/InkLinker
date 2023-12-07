const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_REGION,
    BUCKET_NAME,
} = process.env;
const s3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

module.exports = {
    getSign: async (filename) => {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename, 
        });
        const presignedUrl = await s3Client.getSignedUrl(command, { expiresIn: 3600 }); // URL 有效期
        return presignedUrl;
    }

}
