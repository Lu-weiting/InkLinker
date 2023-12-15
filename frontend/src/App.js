
import "react-quill/dist/quill.bubble.css";
// import "quill-emoji/dist/quill-emoji.css";
// import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import HomePageLayout from "./pages/homePage";
import EditPage from "./pages/EditPage";
import LoginSignUpPage from "./pages/LoginSignUp";
import UserHomePage from "./pages/UserHome";
import { Provider } from "react-redux";
import store from "./redux/store";
const queryClient = new QueryClient();

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
    <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<UserHomePage />} />
                        <Route element={<LoginRoute />}>
                            <Route path="/login" element={<LoginSignUpPage />} />
                        </Route>

                        <Route path="/edit/:post_id" element={<EditPage />} />
                        {/* <Route element={<PrivateRoute />}>
              <Route path="/user" element={<ProfilePage />} />
              <Route path="/thankyou" element={<ThankyouPage />} />
            </Route> */}
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
  );
}

export default App;
