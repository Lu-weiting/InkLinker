import Cookies from "js-cookie";
import usePostSearch from "../hooks/usePostSearch";

import CommonHeader from "../components/layout/header/CommonPageHeader";
import OverviewGroup from "../components/loginHome/Main";

import useInfiniteScroll from "../hooks/useInfiniteScroll";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoadingPosts } from "../redux/LoadingControl";

export default function UserHomePage() {
  const [nextCursor, setNextCursor] = useState(0);
  const [postFetchMode, setPostFetchMode] = useState(""); // ["user_id", "cursor", "user_cursor"]
  const [fetchPosts] = usePostSearch();
  const [posts, setPosts] = useState();
  const [isLoadMorePosts, setIsLoadMorePosts] = useState(false);

  const dispatch = useDispatch();
  const conditionNum = useSelector((state) => state.SearchControl.num);
  const conditions = useSelector((state) => state.SearchControl);

  useEffect(() => {
    async function fetchData() {
      setPostFetchMode("");
      dispatch(setIsLoadingPosts(true));
      console.log("start fetching data");
      try {
        if (conditionNum < 1) {
          const [data, cursor] = await fetchPosts();
          setPosts(data);
          setNextCursor(cursor);
          setPostFetchMode("cursor");
          dispatch(setIsLoadingPosts(false));
          return;
        }
        const [data, cursor] = await fetchPosts("", null, conditions);
        setPosts(data);
        setNextCursor(cursor);
        setPostFetchMode("cursor");
        dispatch(setIsLoadingPosts(false));
      } catch (err) {
        console.error(err);
        // setIsLoadingTasks(false);
      }
    }

    fetchData();
  }, [conditions]);

  const updatePosts = async () => {
    if (!nextCursor || isLoadMorePosts) {
      return;
    }
    setIsLoadMorePosts(true);
    console.log("start fetching data");
    const [newData, cursor] = await fetchPosts(
      postFetchMode,
      nextCursor,
      conditionNum > 0 ? conditions : null
    );
    setPosts((prevData) => [...prevData, ...newData]);
    setNextCursor(cursor);
    setTimeout(() => {
      console.log("finish fetching data");
      setIsLoadMorePosts(false);
    }, 1000);
  };
  useInfiniteScroll(updatePosts, 100);

  return (
    <>
      <CommonHeader />
      <OverviewGroup posts={posts} />
    </>
  );
}