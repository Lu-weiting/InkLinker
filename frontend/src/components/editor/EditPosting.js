import styled from 'styled-components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from 'quill-image-uploader';
// import { quillToMarkdown } from 'quill-markdown';
import TurndownService from 'turndown';
import {io} from 'socket.io-client';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import '../../globalCover.css';
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
Quill.register('modules/imageUploader', ImageUploader);

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;
// const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
// const S3_BUCKET_REGION = process.env.REACT_APP_S3_BUCKET_REGION;
// console.log(S3_BUCKET_REGION);
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
const post_id = 1;
const titleStoreKey = `${post_id}&title`;
const contentStoreKey = `${post_id}&content`;
// TODO
const initialTitleObj = JSON.parse(localStorage.getItem(titleStoreKey)) || '';
const initialContentObj = JSON.parse(localStorage.getItem(contentStoreKey)) || '';


const EditMain = ({ isPublished ,setSaveStatus ,tags}) => {
    const [title, setTitle] = useState(initialTitleObj.title);
    const [text, setText] = useState(initialContentObj.content);
    const [markdown, setMarkdown] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    

    const reactQuillRef = useRef(null);
    const turndownService = new TurndownService();
    const socketRef = useRef(null);


    useEffect(() => {
        const syncData = () => {
            const storedTitle = JSON.parse(localStorage.getItem(titleStoreKey)) || '';
            const storedContent = JSON.parse(localStorage.getItem(contentStoreKey)) || '';

            // 檢查 localStorage 中是否有未同步的數據（可以優化
            // if (storedTitle !== title || storedContent !== text) {
                console.log('Syncing data with server...');
                
                socketRef.current.emit('titleMsg', storedTitle);
                socketRef.current.emit('contentMsg', storedContent);
            // }
        };
        console.log("io before");
        socketRef.current = io(SOCKET_SERVER_URL);
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
                    const response = await axios.post('您的後端API網址', {
                        title,
                        content: text,
                        tags // 假設API需要標籤數據
                    });
                    console.log('Content published:', response.data);
                    // 處理發布成功的邏輯
                } catch (error) {
                    console.error('Error publishing content:', error);
                    // 處理錯誤
                }
            };

            publishContent();
        }
    }, [isPublished]);


    const handleTitleChange = (event) => {
        setTitle(event.target.value);

    };
    const handleTitleBlur = () => {
        setSaveStatus("Saving");
        const titleObj ={
            postId: post_id,
            title: title
        };
        console.log(titleObj);
        localStorage.setItem(titleStoreKey, JSON.stringify(titleObj));
        socketRef.current.emit('titleMsg',  titleObj);
    };
    const handleChange = (value) => {
        // console.log(value);
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
        setSaveStatus("Saving");
        const contentObj ={
            postId: post_id,
            content: text
        };
        console.log(contentObj);
        localStorage.setItem(contentStoreKey, JSON.stringify(contentObj));
        socketRef.current.emit('contentMsg', contentObj);
    };

    // const uploadImage = async () => {
    //     const formData = new FormData();
    //     formData.append('image', file);

    //     try {
    //       const response = await api.post('/images/upload', formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         }
    //       });
    //       return response.data.data.url; 
    //     } catch (error) {
    //       throw error;
    //     }
    //   };
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
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image'],
            ["emoji"]
        ],
        markdownShortcuts: true

        // imageUploader: {
        //     upload: (file) => {
        //         return new Promise((resolve, reject) => {
        //             setTimeout(() => {
        //                 resolve('https://source.unsplash.com/FV3GConVSss/900x500');
        //             }, 3500);
        //         });
        //     }
        // }
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
