// Importing necessary libraries
import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, Field, Form, ErrorMessage } from 'formik';
// import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import Cookies from "js-cookie";
import sweetAlert from 'sweetalert2';
import Alert from "@mui/material/Alert";

import {loginAPI} from '../api/signInAPI';
import {signUpAPI} from '../api/signUpAPI';
// import signInImg from '../assets/images/signIn.jpg';
// import signUpImg from '../assets/images/SignUp.png';
import indexLogo from '../assets/images/indexLogo.png'
import signInImg from '../assets/images/signIn.gif';
import signUpImg from '../assets/images/signUp.gif';



// Styled components
const WindowSet = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100vh;
    align-items: center;
    // position: relative;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 0 0 2rem;
  max-width: 750px;
  width: 45%;
//   background: url('') no-repeat center;
  background-size: cover;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  padding: 0.5rem 0 1rem 0;
`;

const FormContainer = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    padding: 1rem 2rem 2rem 2rem;
    margin-left: 2.2rem;
    width: 80%;
    max-width: 600px
`;

const FormContent = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
`;

const Label = styled.div`
  font-size: 20px;
  color: black;
  font-family: 'Vollkorn', serif; 
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 92%;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  border: 1px solid #818A98 
//   box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  background-color: #d3d3d3;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #c0c0c0;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;
const StyledAlert = styled(Alert)`
  && {
    font-size: 16px;
    color: black;
    font-family: 'Vollkorn', serif; 
    font-weight: 500;
    margin-left: 0;
    width: 92%;
  }
`;
const ToggleBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
  align-items: center;
//   bottom: 5%;
`;
const ToggleButton = styled.button`
  font-size: 18px;
  color: black;
  background: none;
  border: none;
  font-family: 'Vollkorn', serif; 
  font-weight: 500;
  cursor: pointer;
  margin-left: 1rem;
  text-wrap: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleText = styled.div`
  font-size: 16px;
  color: black;
  font-family: 'Vollkorn', serif; 
  font-weight: 500;
  text-wrap: nowrap;
`;
const LogoImage = styled.img`
    margin-left: 2rem;
    margin-bottom: 0.4rem;

`;
const IndexImage = styled.img`
  width: 30%;
//   position: absolute;
  object-fit: cover;
  max-width: 600px;
    max-height: 700px;

`;

// React component
const LoginSignUpPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    // const [cookie, setCookie] = useCookies(["token"]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setCookies = (data) => {
        const maxAge = { expires: 5 / 24 };
        Cookies.set("token", data.access_token, maxAge);
        Cookies.set("user_id", data.user.id.toString(), maxAge);
        Cookies.set("user_name", data.user.name, maxAge);
        Cookies.set("user_email", data.user.email, maxAge);
        Cookies.set("user_avator", data.user.avator, maxAge);
    }
    const handleSubmit = async (values) => {
        setIsLoading(true);
        setErrorMessage("");

        const userSignUpData = {
            name: values.name,
            email: values.email,
            password: values.password
        };

        const userLoginData = {
            provider: "native",
            email: values.email,
            password: values.password
        };

        if (isLogin) {
            const response = await loginAPI(userLoginData);
            if (response) {
                const { access_token, user } = response.data;
                setCookies({ access_token, user });
                navigate(-1);
            }
        } else {
            await signUpAPI(userSignUpData);
            setIsLogin(true);
        }
        setIsLoading(false);
    };
    const handleModeChange = () => {
        setIsLogin(!isLogin);
    };
    const getButtonText = () => {
        if (isLoading && isLogin) {
            return "Loging in...";
        }
        if (isLogin && !isLoading) {
            return "Log in";
        }
        if (isLoading && !isLogin) {
            return "Signing Up...";
        }
        return "Sign Up";
    };

    const validationSchema = Yup.object({
        name: !isLogin ? Yup.string().trim().required("Name is required") : null,
        email: Yup.string()
            .trim()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .trim()
            .min(8, "Password should be a minimum of 8 characters")
            .matches(
                /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/,
                "Password must contain a number, lower and uppercase letter"
            )
            .required("Password is required"),
        confirmPassword: !isLogin
            ? Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required")
            : null,
    });

    const formInitialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    {/* <a href="/">
                <img src={Logo} alt="logo" width={258} height={48} />
            </a> */}
    return (
        <WindowSet>
            <LeftContainer>
                <LogoImage src={indexLogo} alt="logo" width={251} height={77} />

                <FormContainer>
                    <Title>{isLogin ? 'Welcome back' : 'Create a free account'}</Title>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange }) => (
                            <FormContent>
                                {!isLogin && (
                                    <InputContainer>
                                        <Label>User Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. Waiting"
                                            name="name"
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="name">
                                            {(msg) => (
                                                <StyledAlert severity="error">{msg}</StyledAlert>
                                            )}
                                        </ErrorMessage>
                                    </InputContainer>
                                )}
                                <InputContainer>
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        placeholder="e.g. @appworks.tw"
                                        name="email"
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="email">
                                        {(msg) => (
                                            <StyledAlert severity="error">{msg}</StyledAlert>
                                        )}
                                    </ErrorMessage>
                                </InputContainer>
                                <InputContainer>
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="password">
                                        {(msg) => (
                                            <StyledAlert severity="error">{msg}</StyledAlert>
                                        )}
                                    </ErrorMessage>
                                </InputContainer>
                                {!isLogin && (
                                    <InputContainer>
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="e.g. Waiting"
                                            name="confirmPassword"
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="confirmPassword">
                                            {(msg) => (
                                                <StyledAlert severity="error">{msg}</StyledAlert>
                                            )}
                                        </ErrorMessage>
                                    </InputContainer>
                                )}
                                <Button type="submit" name="submit" disabled={isLoading}>
                                    {getButtonText()}
                                </Button>
                            </FormContent>
                        )}
                    </Formik>
                    <ToggleBox>
                        <ToggleText>
                            {isLogin ? 'Not a member?' : 'Already a member?'}
                        </ToggleText>
                        <ToggleButton onClick={handleModeChange}>
                            {isLogin ? 'Sign Up' : 'Log in'}
                        </ToggleButton>
                    </ToggleBox>
                </FormContainer>
            </LeftContainer>
            {/* <div> */}
                <IndexImage src={isLogin ? signInImg : signUpImg} alt="img"/>
                {/* <IndexImage src={indexGif} alt="img"/> */}
            {/* </div> */}
        </WindowSet>
    );
};

export default LoginSignUpPage;
