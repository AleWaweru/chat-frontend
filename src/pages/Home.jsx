import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Home = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  const [likedPost, setLikedPost] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts || []);
          setLikedPost(
            response.data.likedPost?.map((like) => like.postId) || []
          );
        });
    }
  }, []);

  const handleLikes = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { postId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setListOfPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...(post.Likes || []), 0] };
              } else {
                const likesArray = [...(post.Likes || [])]; // Create a new array
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        setLikedPost((prevLikedPost) => {
          if (prevLikedPost.includes(postId)) {
            return prevLikedPost.filter((id) => id !== postId);
          } else {
            return [...prevLikedPost, postId];
          }
        });
      });
  };

  return (
    <div className="w-[50%] p-4 mx-auto ">
      {listOfPosts.map((value, key) => (
        // Add a check for value to avoid accessing properties on null
        value && (
          <div
            key={key}
            className="mb-9 shadow-md border-gray-300 rounded-lg cursor-pointer bg-slate-100 hover:bg-blue-100"
          >
            <div className="text-white font-bold mb-1 justify-center p-2 flex gap-3 bg-blue-400 h-[50px]">
              <h3 className="text-white">Title</h3>
              {value.title}
            </div>
            <div
              onClick={() => {
                navigate(`/post/${value._id}`);
              }}
              className={`text-gray-700 justify-center mb-2 p-2 flex gap-3 h-[80px] ${
                value.postText.length > 100 ? "overflow-scroll" : ""
              }`}
            >
              <h3 className="text-black">Message</h3>
              {value.postText}
            </div>
            <div className="text-sm text-white font-bold p-2 flex justify-between gap-3 bg-blue-400 h-[50px] rounded">
              <div className="flex gap-3">
                <h3 className="text-black">User</h3>
                {value && value.username && (
                  <Link to={`/profile/${value._id}`}>{value.username}</Link>
                )}
              </div>

              <div className="flex justify-center items-center pr-3">
                <div className="mr-3">
                  <FavoriteIcon
                    onClick={() => {
                      handleLikes(value._id);
                    }}
                    className={
                      value.Likes && value.Likes.length > 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />
                </div>
                <div>
                  <label className="text-xl">
                    {value.Likes ? value.Likes.length : 0}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Home;
