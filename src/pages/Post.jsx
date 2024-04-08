import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const Post = () => {
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editTarget, setEditTarget] = useState("");

  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const navigation = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
      console.log("data:", response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
      console.log("data:", response.data);
    });
  }, []);

  const handleComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          postId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val._id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigation("/");
      });
  };

  const handleEdit = (option) => {
    setEditMode(true);
    setEditedValue(option === "title" ? postObject.title : postObject.postText);
    setEditTarget(option);
  };

  const handleSaveEdit = () => {
    if (editTarget === "title") {
      axios.put(
        "http://localhost:3001/posts/title",
        { newTitle: editedValue, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, title: editedValue });
    } else {
      axios.put(
        "http://localhost:3001/posts/postText",
        { newPostText: editedValue, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, postText: editedValue });
    }
    setEditMode(false);
    setEditTarget("");
  };

  const editComment = (id, updatedComment) => {
    axios
      .put(
        `http://localhost:3001/comments/${id}`,
        { commentBody: updatedComment },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        const updatedComments = comments.map((comment) =>
          comment._id === id ? response.data : comment
        );
        setComments(updatedComments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditComment = (id, currentCommentBody) => {
    setEditMode(true);
    setEditTarget(id);
    setEditedValue(currentCommentBody);
  };

  const handleSaveEditComment = () => {
    editComment(editTarget, editedValue);
    setEditMode(false);
    setEditTarget("");
    setEditedValue("");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8 p-4 w-full justify-center">
      <div className="shadow-md w-full md:w-1/2 h-fit bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition duration-300">
        <div
          onClick={() => {
            if (authState.username === postObject.username) {
              handleEdit("title");
            }
          }}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-t-lg cursor-pointer ${
            editMode ? "hidden" : "block"
          }`}
        >
          {postObject.title}
        </div>
        {editMode && editTarget === "title" && (
          <div className="p-4 pt-3">
            <input
              type="text"
              className="border-b border-gray-300 p-2 w-full"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <button
              className="bg-blue-400 text-white py-1 px-4 mt-3 rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        )}

        <div
          onClick={() => {
            if (authState.username === postObject.username) {
              handleEdit("postText");
            }
          }}
          className={`p-4 cursor-pointer ${editMode ? "hidden" : "block"}`}
        >
          <p className="text-gray-700">{postObject.postText}</p>
        </div>
        {editMode && editTarget === "postText" && (
          <div className="p-4">
            <textarea
              className="border-none p-2 rounded w-full"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <button
              className="bg-blue-400 text-white py-1 px-4 rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        )}
        <div className="bg-blue-400 text-md p-2 flex justify-between text-white font-bold  rounded-b-lg">
          <div>Posted by: {postObject.username}</div>
          <div>
            {authState.username === postObject.username && (
              <button
                onClick={() => deletePost(postObject._id)}
                className="text-white py-2 p-1 rounded bg-red-500"
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="shadow-md w-full md:w-1/2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-100 p-4">
        {authState.username ? (
          <div className="flex gap-2 justify-center w-full items-center text-center">
            <textarea
              className="border-none p-2 rounded w-[60%]"
              type="text"
              placeholder="comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleComment}
            >
              Add a Comment
            </button>
          </div>
        ) : (
          <div>
            Please{" "}
            <a className="text-blue-400" href="/login">
              login
            </a>{" "}
            to add a comment.
          </div>
        )}
        <div className="mt-4">
          {comments.map((comment, key) => (
            <div key={key} className="bg-gray-100 p-2 rounded mt-2 block">
              {editMode && editTarget === comment._id ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="border-b border-gray-300 p-2 w-full"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                  />
                  <button
                    className="bg-blue-400 text-white py-1 px-4 rounded"
                    onClick={handleSaveEditComment}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div>{comment.commentBody}</div>
                  <div>
                    <label className="text-blue-700 font-bold">
                      By: {comment.username}
                    </label>
                  </div>
                  <div className="flex justify-end">
                    {authState.username === comment.username && (
                      <>
                        <button
                          onClick={() =>
                            handleEditComment(comment._id, comment.commentBody)
                          }
                          className="text-blue-500 py-2 px-4 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteComment(comment._id)}
                          className="text-white py-2 px-4 rounded bg-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
