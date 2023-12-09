const monitorHandler = require('../Application/Features/Monitor/Queries/GetMonitor/GetMonitorHandler');
module.exports = {
    getMonitor: async(req,res)=>{
        try {
            const response = await monitorHandler.handle(res);
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
        }
    }



}