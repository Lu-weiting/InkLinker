import styled from 'styled-components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from 'quill-image-uploader';
// import { quillToMarkdown } from 'quill-markdown';
import TurndownService from 'turndown';
import { io } from 'socket.io-client';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import axios from 'axios';
import { useParams,useLocation } from "react-router-dom";
import Cookies from "js-cookie";
// import { useLocation } from 'react-router-dom';

import '../../globalCover.css';
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
Quill.register('modules/imageUploader', ImageUploader);

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;
const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const S3_BUCKET_REGION = process.env.REACT_APP_S3_BUCKET_REGION;
const API_ENDPOINT = process.env.REACT_APP_API;
console.log(API_ENDPOINT);
console.log(`SOCKET_SERVER_URL: ${SOCKET_SERVER_URL}`);
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
// const post_id = 1;
//TODO
//先判斷localstorage中的status是yes or no，可以得之是不是地一次進入
//第一次進入頁面==>戳後端createAPI(draft)得到postId之後localstorage就有根據存放



const token= Cookies.get('token');
const user_id= Cookies.get('user_id');
const EditMain = ({ isPublished, setSaveStatus, tags }) => {

    // const params = useParams();
    // const user_id = Cookies.get("user_id");
    // const postId = params.post_id;
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('post_id');

    const titleStoreKey = `${user_id}&${postId}&title`;
    const contentStoreKey = `${user_id}&${postId}&content`;

    const initialTitleObj = JSON.parse(localStorage.getItem(titleStoreKey)) || '';
    const initialContentObj = JSON.parse(localStorage.getItem(contentStoreKey)) || '';

    const [title, setTitle] = useState(initialTitleObj.title);
    const [text, setText] = useState(initialContentObj.content);
    const [markdown, setMarkdown] = useState("");
    const [mainImg, setMainImg] = useState();
    const [isOnline, setIsOnline] = useState(navigator.onLine);



    const reactQuillRef = useRef(null);
    const turndownService = new TurndownService();
    const socketRef = useRef(null);


    useEffect(() => {
        const syncData = () => {
            const storedTitle = JSON.parse(localStorage.getItem(titleStoreKey)) || undefined;
            const storedContent = JSON.parse(localStorage.getItem(contentStoreKey)) || undefined;

            // 空值是可過的
            if (storedTitle !== undefined || storedContent !== undefined) {
                console.log('Syncing data with server...');

                socketRef.current.emit('titleMsg', storedTitle);
                socketRef.current.emit('contentMsg', storedContent);
            }
        };
        console.log("io before");
        socketRef.current = io('https://18.177.160.174', { path: '/api/socket.io' });
        console.log(socketRef.current);
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            syncData();
        });
        socketRef.current.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        console.log("io after");
        socketRef.current.on('msgFromServer', (data) => {
            setSaveStatus('Saved');
            console.log('Received status from server:', data);
        });
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => {
            setIsOnline(false);
            setSaveStatus("Can't Save!!");
        }
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            socketRef.current.disconnect();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    useEffect(() => {
        if (isPublished) {
            // 當 isPublished 變為 true 時執行
            const publishContent = async () => {
                try {
                    const response = await axios.put(`${API_ENDPOINT}/posts/update`, {
                        title,
                        content: text,
                        tags,
                        mainImg: mainImg[0],
                        post_id: postId
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    //sweet alert
                    console.log('Content published:', response.data);
                } catch (error) {
                    console.error('Error publishing content:', error);

                }
            };

            publishContent();
        }
    }, [isPublished]);


    const handleTitleChange = (event) => {
        if (isOnline) {
            setSaveStatus("Saving");
        }
        setTitle(event.target.value);

    };
    const handleTitleBlur = () => {
        const titleObj = {
            postId: postId,
            title: title,
            userId: user_id
        };
        console.log(titleObj);
        localStorage.setItem(titleStoreKey, JSON.stringify(titleObj));
        socketRef.current.emit('titleMsg', titleObj);
    };
    const handleChange = (value) => {
        // console.log(value);
        if (isOnline) {
            setSaveStatus("Saving");
        }
        setText(value);

        if (reactQuillRef.current) {
            //後端存的
            console.log(reactQuillRef.current.value);
            const quill = reactQuillRef.current.getEditor();
            const html = quill.root.innerHTML; // 獲取 HTML 字符串
            // localStorage.setItem('content', JSON.stringify(value));
            const markdown = turndownService.turndown(html);
            console.log(markdown);
            setMarkdown(markdown);
        }
    };
    const handleContentBlur = () => {
        const contentObj = {
            postId: postId,
            content: text,
            userId: user_id
        };
        console.log(contentObj);
        localStorage.setItem(contentStoreKey, JSON.stringify(contentObj));
        socketRef.current.emit('contentMsg', contentObj);
    };

    const uploadImage = async (file) => {
        try {
            // const response = await axios.get(`https://18.177.160.174/generate-presigned-url?filename=${encodeURIComponent(file.name)}`);
            const response = await axios.get(
                `https://18.177.160.174/api/generate-presigned-url`, {
                params: {
                    filename: file.name
                },
            });
            console.log(response.data);
            const { presignedUrl } = response.data;
            console.log('presignedUrl: ' + presignedUrl);
            const uploadResponse = await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (uploadResponse.status === 200) {
                console.log('File successfully uploaded');
                const imageUrl = `https://${BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${encodeURIComponent(file.name)}`;
                setMainImg(prevUrls => [...prevUrls, imageUrl]);
                const quill = reactQuillRef.current.getEditor();
                const range = quill.getSelection();
                const index = range ? range.index : 0;
                quill.insertEmbed(index, 'image', imageUrl);
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'imageBlot' // #5 Optinal if using custom formats
    ];
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['link', 'image'],
                ["emoji"]
            ],
            handlers: {
                image: async () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();
                    input.onchange = async () => {
                        const file = input.files[0];
                        if (file) {
                            // 调用 uploadImage 函数上传图片
                            console.log("file~");
                            await uploadImage(file);
                        }
                    };
                }
            }
        },
        markdownShortcuts: true,
    }), []);



    return (
        <MainContainer>
            <ContentContainer>
                <TitleInput
                    placeholder="Title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                ></TitleInput>

                <ReactQuill
                    ref={reactQuillRef}
                    theme='bubble'
                    value={text}
                    onChange={handleChange}
                    onBlur={handleContentBlur}
                    formats={formats}
                    modules={modules}
                    placeholder="write something"
                />
            </ContentContainer>
        </MainContainer>
    )
};

export default EditMain;
