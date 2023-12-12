import styled from 'styled-components';
import React, { useState } from 'react';
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import SearchBar from '../searchBar';

// import ReactDOM from 'react-dom';
import CommonLogo from '../../../assets/images/editLogo.png'
import Bell from "../../../assets/images/bell.png";
import Member from "../../../assets/images/member.png";
import WriteImg from "../../../assets/images/write.png"


const HeaderContainer = styled.header`
  top: 0;
  width: 100%;
//   position: fixed;
  background-color: white;
  display: flex;
  border-bottom: 1px solid #E6E6E6;
  justify-content: space-between;
  align-items: center;
//   padding: 1rem;
  z-index: 10
`;
const LeftSection = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;
const WriteLink = styled.a`
  display: flex;
  align-items: center;
//   padding: 0.5rem 1rem;
//   background-color: write;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: font-weight 0.3s ease;
//   padding: 0 1rem;


    &:hover {
        font-weight: bold;
    }
   &:hover img{
    transform: scale(1.1);
  }
`;

const WriteImage = styled.img`
  margin-right: 4px;
  transition: transform 0.3s ease; // Smooth transition for the transform
`;
const WriteText = styled.div`
    margin-top: 4px;
    transition: transform 0.3s ease;
    font-family: 'Vollkorn', serif; 
    font-size: 1rem;
    text-align: center;
    color: black;
`;
const LogoDiv = styled.div`
  object-fit; contain;
  marigin-right: 1rem;
`;
const BellA = styled.a`
    padding: 0 0 0 1.5rem;;

    &:hover img{
        transform: scale(1.1);
    }
`;
const MemberA = styled.a`
    padding: 0 0 0 1.5rem;;
    &:hover img{
        transform: scale(1.1);
    }
`;

const user_avator = Cookies.get("user_avator");
const CommonHeader = () => {


    return (
        <HeaderContainer>
            <LeftSection>
                <LogoDiv>
                    <a href="/">
                        <img src={CommonLogo} alt="logo" width={60} height={60} />
                    </a>
                </LogoDiv>
                <SearchBar />
            </LeftSection>
            <RightSection>
                <WriteLink href={Cookies.get("token") ? "/edit" : "/login"}>
                    <WriteImage src={WriteImg} alt='write'></WriteImage>
                    <WriteText>Write</WriteText>
                </WriteLink>
                <BellA href={Cookies.get("token") ? "/" : "/"}>
                    <img src={Bell} alt="bell" width={24} height={24} />
                </BellA>
                <MemberA href={Cookies.get("token") ? "/" : "/"}>
                    <img src={user_avator ? user_avator : Member} alt="prorfile" width={45} height={45} />
                </MemberA>
            </RightSection>
        </HeaderContainer>
    );
};

export default CommonHeader;

