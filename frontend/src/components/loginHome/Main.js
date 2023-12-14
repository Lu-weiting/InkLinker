import styled from 'styled-components';
import PostOverview from './PostOverview';
// import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { Tabs } from 'antd';
import 'antd/dist/reset.css';

import Avatar from '@mui/material/Avatar';
// import TaskOverviewSkeleton from "./Skeleton/TaskOverviewSkeleton";
import { useEffect, useState ,useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../redux/SearchControl";

import { GetPopularPost } from '../../api/popularPostAPI';
import { GetRecommendedHashtags } from '../../api/popularHashtagsAPI';

import member from '../../assets/images/member.png';

const Container = styled.div`
    display: flex;
    // justify-content: center;
    padding: 1rem 3rem 1rem 10rem;
    align-items: center;
    margin-right: 0;
    // margin-top: 80px;
    width: 70%
`;
const Window = styled.div`
    display: flex;
    justify-content: center;
    // align-items: center;
    // margin-top: 80px;
`;
const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-family: 'Vollkorn', serif;
    width: 60%;
`;
const RightContainer = styled.div`
    // top: 0;
    display: flex;
    // position: sticky;
    flex-direction: column;
    
    width: 40%;
    // height: 100%;
    padding: 1rem 7rem 1rem 2rem;
    margin: 0 0 8rem 0;
    text-wrap: wrap;
    align-items: flex-start;
    border-left: 1px solid #D6D3D3;
`;
const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0 1.2rem;
    // width: 100%;
  }
  .ant-tabs-tab {
    padding: 12px 16px;
    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: black;
      font-weight: bold;
      font-family: 'Vollkorn', serif;
    }
  }
  .ant-tabs-ink-bar {
    background: black;
  }
`;
const StickyTabsContainer = styled.div`
    position: sticky;
    top: 0; // 根据需求调整
    width: 100%;
    z-index: 10; // 确保在页面其他内容之上
    background: white; // 可根据实际背景调整
    padding-top: 1rem; // 可根据实际需求调整
    min-width: 750px;
`;


const PopularContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;
    // max-width: 200px;
    word-wrap: break-word;
    width: 100%;
`;
const PopularTitle = styled.p`
    display: flex;
    font-family: 'Vollkorn', serif;
    font-size: 20px;
`;
const PopularPostSection = styled.div`
    display: flex;
    flex-direction: column;
    text-wrap: wrap;
    padding: 1rem 0;
    font-family: 'Vollkorn', serif;
    // max-width: 300px;
    width: 100%;
`;
const PostHead = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const PosterName = styled.div`
    font-size: 14px;
    font-family: 'Vollkorn', serif;
    margin-left: 1rem;
`;
const PostTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    font-family: 'Vollkorn', serif;
    width: 90%;
    max-width: 300px;
`;
const RecommandContainer = styled.div`
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 1rem;
    font-family: 'Vollkorn', serif;
`;
const RecommandTitle = styled.p`
    display: flex;
    font-family: 'Vollkorn', serif;
    font-size: 20px;
`;
const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;
const Tag = styled.div`
    flex: 0 1 auto; 
    padding: 4px 8px;
    background: #F0EFEF;
    border-radius: 20px;
`;





const items = [
    {
        key: '1',
        label: 'Random',
        //   children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'For you',
        //   children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Technology',
        //   children: 'Content of Tab Pane 3',
    },
    // ...根据需要添加更多标签
];



export default function OverviewGroup({ posts, showStatus = false }) {
      const [postList, setPostList] = useState(posts);
    const [tab, setTab] = useState("1");
     const isMounted = useRef(false);
    const dispatch = useDispatch();

    const debounceTimeout = 300; 
      const isLoadingPosts = useSelector(
        (state) => state.LoadingControl.isLoadingPosts
      );
    const { data: PopularData, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ["postPopular"],
        queryFn: () => GetPopularPost(3)
    });
    const {
        data: hashtagsData,
        isLoading: isLoadingHashtags,
        isError: isErrorHashtags,
        error: errorHashtags,
        isSuccess: isSuccessHashtags
    } = useQuery({
        queryKey: ["recommendedHashtags"],
        queryFn: GetRecommendedHashtags
    });


   

    useEffect(() => {
        if (isMounted.current) {
            // 使用 setTimeout 計時器來實現 debounce
            const timerId = setTimeout(() => {
                dispatch(setSelectedTab(tab));
            }, debounceTimeout);

            // 在每次 useEffect 被重新調用時，清除之前的計時器
            return () => {
                clearTimeout(timerId);
            };
        } else {
            // Update the ref to indicate the component has been mounted
        }
    }, [tab]);
    useEffect(() => {
        if (hashtagsData) {
            console.log(hashtagsData);
        }
    }, [hashtagsData]);
    useEffect(() => {
        if (PopularData) {
            console.log(PopularData);
        }
    }, [PopularData]);
    
    const postOverviewItems =
        postList &&
        postList.map((post) => (
            <PostOverview
                key={post.id}
                post={post}
                showStatus={showStatus}
            ></PostOverview>
        ));
    const popularPosts =
        PopularData &&
        PopularData.posts.map((post) => (
            <PopularPostSection key={post.id}>
                <PostHead>
                    <Avatar
                        alt="author"
                        src={post.author.avatar ? post.author.avatar : member}
                        sx={{ width: 20, height: 20 }}
                    />
                    <PosterName>{post.author.name}</PosterName>
                </PostHead>
                <PostTitle>{post.title}</PostTitle>
            </PopularPostSection>

        ));
    const recommendedHashtags =
        hashtagsData &&
        hashtagsData.hashtags.map((hashtag) => (
            <Tag key={hashtag.id}>{hashtag.name}</Tag>
        ));

    const onTabChange = (key) => {
        setTab(key);
    };


    return (
        <Window>
            <Container>
                <LeftContainer>
                    <StickyTabsContainer>
                        <StyledTabs defaultActiveKey="1" items={items} onChange={onTabChange} />
                    </StickyTabsContainer>

                    {postOverviewItems}
                </LeftContainer>
            </Container>
            <RightContainer>
                <PopularContainer>
                    <PopularTitle>
                        Top 3 post
                    </PopularTitle>
                    {popularPosts}
                </PopularContainer>
                <RecommandContainer>
                    <RecommandTitle>Recommanded topic</RecommandTitle>
                    <TagContainer>
                        {recommendedHashtags}
                    </TagContainer>
                </RecommandContainer>
            </RightContainer>
        </Window>

        // <div className="flex flex-col items-center gap-2 z-1 relative">
        //   {postOverviewItems}
        //   {/* {isLoadingTasks && <TaskOverviewSkeleton />}
        //   {isLoadingTasks && <TaskOverviewSkeleton />}
        //   {isLoadingTasks && <TaskOverviewSkeleton />}
        //   {isLoadingTasks && <TaskOverviewSkeleton />} */}
        // </div>
    );
}