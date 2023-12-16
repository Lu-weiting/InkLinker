import Cookies from "js-cookie";
import usePostSearch from "../hooks/usePostSearch";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// const [isTaskAssigner, setIsTaskAssigner] = useState(false);
// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setIsLoadingPosts } from "../redux/LoadingControl";
// import { GetPostDetail } from "../api/postDetailAPI";


// const PostDetail = () => {
//     const { id } = useParams();
//     const userId = Cookies.get("user_id");

//     console.log("testId:"+id);
//     const { data, isLoading, isError,error,isSuccess } = useQuery({
//         queryKey: ["postDetails", id],
//         queryFn: () => GetPostDetail(id)
//     });
    

//   return (
   
//   );
// }
