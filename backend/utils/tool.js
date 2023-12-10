const multer = require('multer'); // 引入 multer 套件，用於處理上傳檔案
const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config();
module.exports = {
    uploadPicture: () => {
        //TODO: 驗證副檔名、限制檔案大小
        const upload = multer({
            storage: multer.memoryStorage(),
        });
        return upload;
    },
    checkEmail: async (email) => {
        const emailRegex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        return emailRegex.test(email);
    },
    generateHashPassword: async (password) => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
    /**
     * check the input password
     * @param {string} input - The input password from client
     * @param {Object} real - The hashed password in db
     * @returns {boolean}
     */
    confirmPassword: async (input, real) => {
        return bcrypt.compare(input, real);
    },
}