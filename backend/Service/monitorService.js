const errorMsg = require('../utils/error');
const monitorRepo = require('../Repository/monitorRepo');
module.exports = {
    insertOrderList: async (res, dataObjArray) => {
        const connection = await connectionPromise.getConnection();
        try {
            await monitorRepo.insertOrderList(res, dataObjArray, connection);

        } catch (error) {
            console.log(error);
            await connection.rollback();
            errorMsg.query(res);
        } finally {
            console.log('connection release');
            connection.release();
        }
    },
    simpleSearch: async (res) => {
        const result = await monitorRepo.simpleSearch(res);
        return result;
    },
    monitorByColor: async (res) => {
        const result = await monitorRepo.monitorByColor(res);
        return result;
    },
    monitorByPriceRange: async (res) => {
        const result = await monitorRepo.monitorByPriceRange(res);
        return result;
    },
    monitorBySize: async (res) => {
        const result = await monitorRepo.monitorByTopSize(res);
        return result;
    },
    monitorRevenue: async (res) => {
        const result = await monitorRepo.monitorRevenue(res);
        return result;
    },

}
