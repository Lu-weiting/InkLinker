import Cookies from "js-cookie";
import usePostSearch from "../hooks/usePostSearch";
import { useQuery } from "@tanstack/react-query";
// import CommonHeader from "../components/layout/header/CommonPageHeader";
// import OverviewGroup from "../components/loginHome/Main";
import { useParams } from "react-router-dom";
const [isTaskAssigner, setIsTaskAssigner] = useState(false);
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoadingPosts } from "../redux/LoadingControl";
import CommonHeader from "../components/layout/header/CommonPageHeader";
import { GetPostDetail } from "../api/postDetailAPI";

const PostDetailPage = () => {
    const { id } = useParams();
    const userId = Cookies.get("user_id");

    console.log("testId:"+id);
    const { data, isLoading, isError,error,isSuccess } = useQuery({
        queryKey: ["postDetails", id],
        queryFn: () => GetPostDetail(id)
    });
    

  return (
    <>
      <CommonHeader />
      
    </>
  );
}