module.exports = {
    customize: async(result)=>{
        console.log(result);
        const response = {
            data: {
                totalRevenue: result.totalRevenue,
                color_code: result.colorResObj.color_code,
                color_name: result.colorResObj.color_name,
                total_count: result.colorResObj.total_count,
                price: result.priceRangeMonitor,
                top: result.topProductSizeMonitor
            }
        };
        return response;
    }
}