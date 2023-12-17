import axios from "axios";

const api = process.env.REACT_APP_API;

export async function GetPostDetail (id,token)  {
    try {
        const response = await axios.get(
            `${api}/posts/detail`, {
            params: {
                id,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};