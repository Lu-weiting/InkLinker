import axios from "axios";
import sweetAlert from "sweetalert2";
// import { date } from "yup";

export async function loginAPI(body) {
  const api = process.env.REACT_APP_API;
  const apiUrl = `${api}/users/signin`;
  console.log(apiUrl);
  console.log("login data: ",body);
  try {
    console.log("login data: ",body);
    const response = await axios.post(apiUrl, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        sweetAlert(
          "Email or Password incorrect",
          "Please try again",
          "error"
        );
      } else if (error.response.status === 422) {
        sweetAlert(
          "Invalid Email or Password format",
          "Please try again",
          "error"
        );
      } else if (error.response.status === 403) {
        sweetAlert(
          "Email or Password incorrect",
          "Please try again",
          "error"
        );
      } else {
        sweetAlert("An error occurred", "Please try again later", "error");
        console.error("Error:", error);
      }
    }
    // 處理錯誤
    return null;
  }
}
