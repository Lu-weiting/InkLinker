import Cookies from "js-cookie";
import styled from 'styled-components';
// import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LikeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, FloatButton } from 'antd';
import Avatar from '@mui/material/Avatar';
import { formatDistance } from 'date-fns';
import axios from "axios";
import member from '../../assets/images/member.png';
import Fave from "./fave";
import DOMPurify from 'dompurify';
import debounce from 'lodash.debounce';
const api = process.env.REACT_APP_API;
// import { useSelector, useDispatch } from "react-redux";
// import { setIsLoadingPosts } from "../redux/LoadingControl";

const Window = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10rem;
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    padding-top: 2rem;
`;
const TitleContainer = styled.div`
    width: 100%;
    display: flex;
    word-wrap: break-word;
`;
const Title = styled.p`
    width: 100%;
    font-size: 42px;
    font-weight: bold;
    font-family: 'Vollkorn', serif; 
    text-align: left;
    color: #333;

`;
const UserInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0;
    width: 100%;
`;
const OtherInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    // align-items: center;

    margin-left: 1rem;
`;
const UserName = styled.div`
    font-size: 20px;
    font-weight: 500;
    font-family: 'Vollkorn', serif; 
    // margin-bottom: 5px;
`;
const CreateDate = styled.div`
    font-size: 16px;
    font-family: 'Vollkorn', serif; 
    margin-top: 3px;
    color: #666;
`;
const SocialContainer = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;
    border-top: 1px solid #E6E6E6;
    justify-content: space-between;
    padding: 0.6rem 1rem 0.6rem 1rem;
`;
const PostContentContainer = styled.div`
    width: 100%;
    display: flex;
    margin-top: 1rem;
    word-wrap: break-word;
`;
const PostContent = styled.div`
    // display: flex;
    width: 100%;
    font-size: 22px;
    font-family: 'Vollkorn', serif; 
`;
const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 3rem;
`;
const Tag = styled.div`
    flex: 0 1 auto; 
    padding: 8px 10px;
    background: #F0EFEF;
    border-radius: 20px;
`;
const FaveContainer = styled.div`
    height: 35px;
    width: 35px;
    position: relative;
    cursor: pointer;
`;
const DotBtn = styled.button`
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: white;
    border: none;
    transition: font-weight 0.3s ease;
    
    &:hover {
        font-weight: bold;
    }
    &:hover img {
        transform: scale(1.1);
    }
`;
const SocialLeftContainer = styled.div`
    display: flex;

    // align-items: center;
`;
const LikeCountDiv = styled.div`
    font-size: 18px;
    font-weight: 400;
    padding: 10px 0 0 5px;
`;



const PostDetail = ({ post , islike}) => {
    const [isTaskAssigner, setIsTaskAssigner] = useState(false);
    const [fave, setFave] = useState(islike.is_like);
    const [lastFaveState, setLastFaveState] = useState(fave);
    const [likeCount, setLikeCount] = useState(post.like_count);
    const userId = Cookies.get("user_id");
    const token = Cookies.get('token');
    console.log("likeCount:",likeCount);
    console.log("fave:",fave);
    console.log("authorOrnot:",isTaskAssigner)
    // const userId = 1;
    const {
        id,
        title,
        content,
        created_at,
        tags,
        author
    } = post;

    useEffect(() => {
        setIsTaskAssigner(author.id == userId);
      }, [author.id, userId]);

    useEffect(() => {
        setFave(islike.is_like);
        setLastFaveState(fave);
        setLikeCount(post.like_count);
    }, [post]);
    const cleanContent = DOMPurify.sanitize(content);
    const items = [
        {
            key: '1',
            label: (
                <a href={`/edit?post_id=${id}`}>
                    Edit
                </a>
            ),
        }
    ];

    const hashtags =
        tags &&
        tags.map((hashtag,index) => (
            <Tag key={index}>{hashtag}</Tag>
        ));

    const pastDate = new Date(created_at);
    const now = new Date();
    const relativeTime = formatDistance(pastDate, now, { addSuffix: true });
    const sendLikeRequest = async (newFave) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            if (newFave) {
                await axios.post(`${api}/posts/${id}/like`, {}, config);
            } else {
                await axios.delete(`${api}/posts/${id}/like`, config);
            }
            setLastFaveState(newFave);
        } catch (error) {
            console.error('Error handling like', error);
        }
    };
    const debouncedSendLikeRequest = debounce(sendLikeRequest, 1000); // 用户停止操作1秒后触发
    //可能fave來不急更新
    const handleLikeClick = () => {
        setFave(prev => {
            // 立即更新点赞计数，基于即将设置的点赞状态
            setLikeCount(likeCount => prev ? likeCount - 1 : likeCount + 1);
            const newFave = !prev;
            debouncedSendLikeRequest(newFave); 
            return newFave;
        });
    }


    return (
        <Window>
            <Container>
                <TitleContainer>
                    <Title>
                        {title}
                    </Title>
                </TitleContainer>
                <UserInfo>
                    <Avatar
                        alt="author"
                        src={author.avatar || member}
                        sx={{ width: 50, height: 50 }}
                    />
                    <OtherInfoContainer>
                        <UserName>{author.name}</UserName>
                        <CreateDate>{relativeTime}</CreateDate>
                    </OtherInfoContainer>
                </UserInfo>
                <SocialContainer>
                    <SocialLeftContainer>
                        <FaveContainer onClick={handleLikeClick}>
                            <Fave size={50} fave={fave} />
                        </FaveContainer>
                        <LikeCountDiv>
                            {likeCount}
                        </LikeCountDiv>
                    </SocialLeftContainer>

                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement=""
                        arrow
                        disabled={!isTaskAssigner}
                    >
                        <DotBtn>
                            <MoreOutlined />
                        </DotBtn>
                    </Dropdown>
                </SocialContainer>
                <PostContentContainer>
                    <PostContent dangerouslySetInnerHTML={{ __html: cleanContent }} />
                </PostContentContainer>
                <TagsContainer>
                    {hashtags}
                </TagsContainer>
                <FloatButton.BackTop />
            </Container>
        </Window>
    );
}

export default PostDetail;
