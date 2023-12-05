import styled from 'styled-components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from 'quill-image-uploader';
// import { quillToMarkdown } from 'quill-markdown';
import TurndownService from 'turndown';
import io from 'socket.io-client';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import '../../globalCover.css';
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
Quill.register('modules/imageUploader', ImageUploader);

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;
console.log(SOCKET_SERVER_URL);
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
const initialTitle = JSON.parse(localStorage.getItem('title')) || '';
const initialContent = JSON.parse(localStorage.getItem('content')) || '';

const EditMain = ({ isPublished }) => {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialContent);
    const [markdown, setMarkdown] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const reactQuillRef = useRef(null);
    const turndownService = new TurndownService();
    const socketRef = useRef(null);


    useEffect(() => {
        const syncData = () => {
            const storedTitle = JSON.parse(localStorage.getItem('title')) || '';
            const storedContent = JSON.parse(localStorage.getItem('content')) || '';

            // 檢查 localStorage 中是否有未同步的數據（可以優化
            if (storedTitle !== title || storedContent !== text) {
                console.log('Syncing data with server...');
                socketRef.current.emit('titleMsg', { title: storedTitle });
                socketRef.current.emit('contentMsg', { content: storedContent });
            }
        };
        socketRef.current = io(SOCKET_SERVER_URL);
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            syncData();
        });
        socketRef.current.on('msgFromServer', (data) => {
            console.log('Received data from server:', data);
        });
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            socketRef.current.disconnect();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    
    const handleTitleChange = (event) => {
        setTitle(event.target.value);

    };
    const handleTitleBlur = () => {
        localStorage.setItem('title', JSON.stringify(title));
        socketRef.current.emit('titleMsg', { title: title });
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
        localStorage.setItem('content', JSON.stringify(text));
        socketRef.current.emit('contentMsg', { content: text });
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
