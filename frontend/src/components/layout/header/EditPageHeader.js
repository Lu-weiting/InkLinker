import styled from 'styled-components';
import React from 'react';
import EditLogo from '../../../assets/images/editLogo.png'
import Bell from "../../../assets/images/bell.png";
import Dots from "../../../assets/images/dots.png";
import Member from "../../../assets/images/member.png";

const HeaderContainer = styled.header`
  top: 0;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.625rem 3rem 1.625rem 7rem;
  

//   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
const LeftSection = styled.div`
    display: flex;
    align-items: center;
    margin-left: 3.75rem;
`;
const DraftText = styled.span`
    font-family: 'Vollkorn', serif;
    font-size: 1rem;
    padding-left: 1rem;
    color: black;
`;
const EditStatus = styled.span`
    font-family: 'Vollkorn', serif; 
    font-size: 1rem;
    padding-left: 1.5rem;
    color: #989292;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15rem;
`;
const PublishBtn = styled.button`
    width: 6rem;
    height: 2rem;
    background: #D2BAAC;
    border-radius: 150px;
    margin-left: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
`;
const RightSmallSection =styled.div`
    padding: 0 0.8rem;
`;





// token...
const username = 'Tim';
// socket msg from backend
const status = 'Saved';


const EditHeader = ({setIsPublished, saveStatus}) => {
  return (
      <HeaderContainer>
        <LeftSection>
            <a href="/">
                <img src={EditLogo} alt="logo" width={63} height={70} />
            </a>
            <DraftText>Draft in {username}</DraftText>
            <EditStatus>{saveStatus}</EditStatus>
        </LeftSection>
        <RightSection>
            <PublishBtn
                type="button"
                onClick={() => {
                    setIsPublished(true);
                }}
            >
                Publish
            </PublishBtn>
            <RightSmallSection>
                <img src={Dots} alt="dots" width={30} height={24} />
            </RightSmallSection>
            <RightSmallSection>
            <img src={Bell} alt="bell" width={30} height={30} />
            </RightSmallSection>
            <RightSmallSection>
            <img src={Member} alt="member" width={40} height={40} />
            </RightSmallSection>
            
        </RightSection>
      </HeaderContainer>
  );
};

export default EditHeader;

