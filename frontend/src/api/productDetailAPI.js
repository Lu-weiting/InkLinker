import axios from "axios";

const api = process.env.REACT_APP_API;

export async function GetProductDetail (id)  {
    try {
        const response = await axios.get(
            `${api}/posts/detail`, {
            params: {
                id,
            },
        });
        
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};