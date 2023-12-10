
import "react-quill/dist/quill.bubble.css";
// import "quill-emoji/dist/quill-emoji.css";
// import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
// import HomePageLayout from "./pages/homePage";
import EditPage from "./pages/EditPage";
import LoginSignUpPage from "./pages/LoginSignUp";

const LoginRoute = () => {
  const isLoggedIn = Cookies.get("token");
  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
};

const PrivateRoute = () => {
  const isLoggedIn = Cookies.get("token");
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<HomePageLayout endpoint="all" />} /> */}
          <Route element={<LoginRoute />}>
              <Route path="/login" element={<LoginSignUpPage />} />
            </Route>
            <Route path="/edit" element={<EditPage endpoint="edit" />} />
            {/* <Route element={<PrivateRoute />}>
              <Route path="/user" element={<ProfilePage />} />
              <Route path="/thankyou" element={<ThankyouPage />} />
            </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
