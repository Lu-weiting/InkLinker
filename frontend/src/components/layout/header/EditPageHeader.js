import styled from 'styled-components';
import React, { useState } from 'react';
import EditLogo from '../../../assets/images/editLogo.png'
import Bell from "../../../assets/images/bell.png";
import Dots from "../../../assets/images/dots.png";
import Member from "../../../assets/images/member.png";
// import Swal from "sweetalert2";
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import Modal from '../../../hooks/Modal';
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
    font-weight: bold;
    color: #FFFFFF; 
    transition: background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease; // 添加過渡效果

    &:hover {
        background: #BAA492; 
        color: black; 
        cursor: pointer;
    }
`;
const RightSmallSection = styled.div`
    padding: 0 0.8rem;
`;





// token...
const username = 'Tim';


const EditHeader = ({ setIsPublished, saveStatus, setTags }) => {
    const [inputTags, setInputTags] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    // const handlePublish = () => {
    //     Swal.fire({
    //         title: 'Enter Hashtags',
    //         input: 'text',
    //         inputAttributes: {
    //             autocapitalize: 'off'
    //         },
    //         showCancelButton: true,
    //         confirmButtonText: 'Submit',
    //         showLoaderOnConfirm: true,
    //         preConfirm: (tags) => {
    //             setTags(tags.split(' ')); // 分割字符串成標籤數組
    //             setIsPublished(true);
    //         }
    //     });
    // };
    const handlePublish = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTags(inputTags);
        setIsPublished(true);
    };
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
                    onClick={handlePublish}
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
            <Modal isOpen={isModalOpen} onClose={handleModalClose} userName={'Tim'}>
                <ReactTagInput
                    tags={inputTags}
                    onChange={(newTags) => setInputTags(newTags)}
                    placeholder="Type ..."
                />
            </Modal>
        </HeaderContainer>
    );
};

export default EditHeader;

