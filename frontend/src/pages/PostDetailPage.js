import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

import CommonHeader from "../components/layout/header/CommonPageHeader";
import { GetPostDetail , GetUserLikeRecord} from "../api/postDetailAPI";
import PostDetail from "../components/postDetail/postDetail";

const PostDetailPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  console.log("testId:" + id);
  const { data: postData, isLoading: isPostLoading, isError: isPostError, error: postError } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: () => GetPostDetail(id, token)
  });

  // 获取用户点赞记录
  const { data: userLikeData, isLoading: isUserLikeLoading, isError: isUserLikeError, error: userLikeError } = useQuery({
    queryKey: ["userLikeRecord", id],
    queryFn: () => GetUserLikeRecord(id, token)
  });

  return (
    <>
      <CommonHeader />
      {!isPostLoading &&!isUserLikeLoading && <PostDetail post={postData} islike={userLikeData}/>}
    </>
  );
}

export default PostDetailPage;