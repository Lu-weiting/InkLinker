import axios from "axios";

const api = process.env.REACT_APP_API;


export async function GetPopularPost (number)  {
    try {
        const response = await axios.get(
            `${api}/posts/popular`, {
            params: {
                number,
            },
        });
        
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};
