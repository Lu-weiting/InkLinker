const axios = require('axios');


module.exports = {
    fetchOrder: async () => {
        const response = await axios.get('http://35.75.145.100:1234/api/1.0/order/data');
        const orders = response.data;

        let processedData = [];
        orders.forEach(order => {
            order.list.forEach(item => {
                processedData.push({
                    price: item.price,
                    color_code: item.color.code,
                    color_name: item.color.name,
                    size: item.size,
                    qty: item.qty,
                    product_id: item.id
                }
                    
                );
            });
        });

        return processedData;
    },
    processColorData: async (dataFromDb) => {
        const res = {
            color_code: dataFromDb.map(item => item.color_code),
            color_name: dataFromDb.map(item => item.color_name),
            total_count: dataFromDb.map(item => item.total_count),
        };
        return res;
    }
}