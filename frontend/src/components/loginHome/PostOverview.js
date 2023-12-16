import styled from 'styled-components';
// import sweetAlert from "sweetalert";
import member from '../../assets/images/member.png';
import test from '../../assets/images/test.jpeg';
import Avatar from '@mui/material/Avatar';
import { formatDistance } from 'date-fns';
// import member from '../../assets/images/member';
const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 1rem 1rem 1.5rem;
  align-items: flex-start;
  border-bottom: 1px solid #D6D3D3;
  font-family: 'Vollkorn', serif;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  width: 100%;
  min-width: 750px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CreateTime = styled.span`
  margin-left: auto;
  margin-left: 0.5rem;
`;

const AuthorName = styled.span`
  margin-left: 0.5rem;
  font-size: 1rme;
//   font-weight: bold;
`;

const PostBody = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  text-wrap: wrap;
// word-wrap: break-word;
// overflow-wrap: break-word;
`;

const PostTextContainer = styled.div`
//   flex-grow: 1;
    display: flex;
    flex-direction: column;
    text-wrap: wrap;
    width: 65%;
`;

const PostTitle = styled.h2`
    font-size: 24px;
    color: #333;
    font-weight: bold;
    text-wrap: wrap;
    // overflow-wrap: break-word;
    width: 92%;
`;

const PostSubtitle = styled.h3`
  font-size: 18px;
  color: #666;
`;

const PostImage = styled.img`
  height: 100%;
  width: auto;
  margin-left: 1rem;
  border-radius: 4px;
  max-width: 112px;
  max-height: 112px;

`;
const Tag = styled.div`
    flex: 0 1 auto; 
    padding: 4px 8px;
    margin-top: 2rem;
    background: #F0EFEF;
    border-radius: 15px;
`;
const Link = styled.a`
    // overflow-wrap: break-word;
    // text-wrap: wrap;
    word-wrap: break-word;
    display: block; /* 或者使用 'inline-block' */
    text-decoration: none; /* 可选，去除下划线 */

`;
export default function PostOverview({ post, showStatus }) {
    //TODO: chatGPT --> main_tag
    const {
        id,
        title,
        content,
        main_category,
        created_at,
        img_url,
        author
    } = post;
    function extractFirstH2Content(htmlString) {
        // 創建一個新的DOM解析器
        var parser = new DOMParser();
        // 解析字串為HTML文檔
        var doc = parser.parseFromString(htmlString, 'text/html');
        // 獲取第一個<h2>標籤
        var h2Element = doc.querySelector('h2');
        // 返回<h2>標籤的內容，如果不存在<h2>，則返回null
        return h2Element ? h2Element.textContent : '';
    }
    const subtitle = extractFirstH2Content(content);
    const pastDate = new Date(created_at); // 過去的某個時間
    const now = new Date();
    const relativeTime = formatDistance(pastDate, now, { addSuffix: true });

    return (
        <PostContainer>
            <PostHeader>
                <Avatar
                    alt="author"
                    src={author.avatar || member}
                    sx={{ width: 30, height: 30 }}
                />
                <AuthorName>{author.name}</AuthorName>
                <CreateTime>{relativeTime}</CreateTime>
            </PostHeader>
            <Link href={`/posts/${id}`} data-testid="post-card">
                <PostBody>
                    <PostTextContainer>
                        <PostTitle>{title}</PostTitle>
                        <PostSubtitle>{subtitle}</PostSubtitle>
                    </PostTextContainer>
                    <PostImage src={img_url ? img_url : test} alt="Post image" />
                </PostBody>
            </Link>
            <Tag>
                {main_category}
            </Tag>
        </PostContainer>
    );
}