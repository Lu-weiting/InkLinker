import axios from "axios";
import Swal from "sweetalert2";
// import { date } from "yup";
const api = process.env.REACT_APP_API;
export async function loginAPI(body) {
  // const api = process.env.REACT_APP_API;
  const apiUrl = `${api}/users/signin`;
  console.log(apiUrl);
  try {
    const response = await axios.post(apiUrl, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error?.response?.status === 403) {
        Swal.fire("未註冊", `${error}`, "error");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        console.log(error.response.status);
        Swal.fire("登入失敗", `${error}`, "error");
      }
    }
  }
}
