import axios from "axios";

export async function GetOrderList ()  {
    try {
        const response = await axios.get(
            `https://18.177.160.174/api/1.0/monitor`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};