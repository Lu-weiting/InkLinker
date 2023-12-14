const connectionPromise = require('../utils/db').connectionPromise;
const categoryRepo = require('../Repository/categoryRepo');

module.exports = {
    getAll: async () => {
        const result = await categoryRepo.getAll();
        return result;
    }

}