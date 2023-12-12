/* eslint-disable no-undef */
import axios from "axios";
import Cookies from "js-cookie";
// import { useCookies } from "react-cookie";

export default function usePostSearch() {
    //   const [cookies] = useCookies(["token"]);
    const token = Cookies.get("token")
    console.log(token);
    let thereIsCondition = false;

    const apiProcess = (mode = "", cursor = 0, conditions = null , userId = null) => {
        let api = process.env.REACT_API;
        let apiUrl = `${api}/posts/search?`;
        if (!conditions) {
            if (mode === "cursor") {
                return (apiUrl += `cursor=${cursor}`);
            }
            return `${api}/posts/search`;
        }

        const { title, num } = conditions;

        if (num < 1) {
            apiUrl = `${api}/posts/search`;
        }
        if (title) {
            if (thereIsCondition) {
                apiUrl += "&";
            } else if (num < 1) {
                apiUrl += "?";
            }
            apiUrl += `title=${title}`;
            thereIsCondition = true;
        }
        if (userId != null) {
            apiUrl = `${api}/posts/recommand?userId=${userId}`;
            thereIsCondition = true;
        }


        if (mode === "cursor") {
            if (thereIsCondition) {
                apiUrl += "&";
            } else {
                apiUrl += "?";
            }
            apiUrl += `cursor=${cursor}`;
        }

        thereIsCondition = false;

        return apiUrl;
    };

    const fetchData = async (mode = "", cursor = 0, conditions) => {
        if (mode === "cursor" && !cursor) {
            return;
        }
        const apiUrl = apiProcess(mode, cursor, conditions);

        try {
            const header_config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("apiUrl", apiUrl);
            const response = await axios.get(apiUrl, header_config);

            if (response.status === 200) {
                // eslint-disable-next-line consistent-return
                console.log(response);
                return [response?.data.data.posts, response?.data.data.next_cursor];
            }
            console.error("Error:", response.status);
            // 處理錯誤狀態
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            }
        }
    };

    return [fetchData];
}