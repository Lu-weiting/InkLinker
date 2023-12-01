import styled from 'styled-components';
import React from 'react';
import { useState } from "react";
import ReactQuill from "react-quill";
import '../../globalCover.css';
const MainContainer = styled.div`
    width: 100%;
    // background-color: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContentContainer = styled.div`
    width: 60%;
    padding-top: 1.5rem;
    font-family: 'Vollkorn', serif;
    text-align: left;
`;

const TitleInput = styled.input`
  font-size: 2rem;
  color: black;
  background
  font-weight: normal;
  border: none;
  padding: 10px 15px;

//   background-color: #f8f8f8;
    background-color: white;    

  &::placeholder {
    font-family: 'Vollkorn', serif;
    color: #BBB9B9;
  }

  &:focus {
    outline: none;
  }
`;

const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ header: [1, 2, false] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
        [{ 'size': ['12px', '14px', '16px', '18px', '20px'] }],
        [{ color: [] }, { background: [] }]
    ]
};




const EditMain = ({isPublished}) => {
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");

    const handleChangeValue = (value) => {
        console.log("富文本的值：", value);
        setValue(value);
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        console.log(event.target.value)
    };
    return (
        <MainContainer>
            <ContentContainer>
                <TitleInput
                    placeholder="Title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                ></TitleInput>
                <ReactQuill
                    theme="bubble"
                    value={value}
                    onChange={handleChangeValue}
                    placeholder="write something"
                    modules={modules}
                />
            </ContentContainer>
        </MainContainer>
    )
};

export default EditMain;
