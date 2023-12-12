import axios from "axios";

const api = process.env.REACT_APP_API;


export async function GetRecommendedHashtags ()  {
    try {
        const response = await axios.get(
            `${api}/hashtags/recommand`);
        
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};
