import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  let {id} = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/auth/basicInfo/${id}`)
      .then((response) => {
        setUsername(response.data.username)
      });
    axios
      .get(`http://localhost:3001/posts/byUserId/${id}`)
      .then((response) => {
        setListOfPosts(response.data)
      });
  }, []);
  

  return (
    <div className=" w-[50%] mx-auto">
      <div className="justify-center items-center text-center m-4" >
        <h1 className="text-black mb-6 font-serif font-bold">UserName: <span className="text-pink-700 uppercase">{username}</span> </h1>
       {
         authState.username === username &&  <button onClick={()=>navigate("/changepassword")} className="text-white py-2 p-1 rounded bg-gray-500 mb-3">Change Password</button>
       } 
        <h2 className="mb-6 font-serif font-extrabold text-blue-700">NO. OF POSTS MADE</h2>
        {listOfPosts.map((value, key) => (
        <div
          key={key}
          className="mb-9 shadow-md border-gray-300 rounded-lg cursor-pointer  bg-slate-100 hover:bg-blue-100"
        >
          <div className="text-white font-bold mb-1 justify-center p-2 flex gap-3 bg-blue-400 h-[50px]">
            <h3 className="text-white">Title</h3>
            {value.title}
          </div>
          <div
            onClick={() => {
              navigate(`/post/${value.id}`);
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
              <h3 className="text-blck">User</h3>
              {value.username}
            </div>
            <div className="flex justify-center items-center pr-3">
              <div className="mr-3">
                <FavoriteIcon
                  className={value.Likes.length > 0 ? "text-red-500" : "text-gray-500"}
                />
              </div>
              <div>
                <label className="text-xl">{value.Likes.length}</label>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Profile;
