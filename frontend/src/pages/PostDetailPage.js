import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

import CommonHeader from "../components/layout/header/CommonPageHeader";
import { GetPostDetail } from "../api/postDetailAPI";
import PostDetail from "../components/postDetail/postDetail";

const PostDetailPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  console.log("testId:" + id);
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: () => GetPostDetail(id,token)
  });
  return (
    <>
      <CommonHeader />
      {!isLoading && <PostDetail post={data} />}
    </>
  );
}

export default PostDetailPage;