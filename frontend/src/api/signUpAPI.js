/* eslint-disable no-undef */
import axios from "axios";
// import sweetAlert from "sweetalert";
import Swal from "sweetalert2";

export async function signUpAPI(body) {
    const api = process.env.API_URL;
    const apiUrl = `${api}/users/signup`;

    try {
        const response = await axios.post(apiUrl, body);
        console.log(response);
        Swal.fire("註冊成功", "歡迎使用Stylish", "success");
    } catch (error) {
        if (error.response) {
            if (error?.response?.status === 409) {
                Swal.fire("信箱已使用", `${error}`, "error");
            }
            if (error?.response?.status >= 500 && error?.response?.status < 600) {
                Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
            } else {
                Swal.fire("註冊失敗", `${error}`, "error");
            }
        }
    }

}