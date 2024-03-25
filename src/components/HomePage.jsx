import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Post from "../pages/Post";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import { useState, useEffect } from "react";
import axios from "axios";
import PageNotFound from "../pages/PageNotFound";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";

function HomePage() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="w-full mx-auto">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="p-4 mb-4 flex justify-between items-center bg-blue-300">
            {!authState.status ? (
              <div className="flex justify-end px-4">
                <Link
                  className="text-white py-2 px-5 mr-4 rounded bg-purple-500"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="text-white py-2 px-4 rounded bg-purple-500"
                  to="/register"
                >
                  Registration
                </Link>
              </div>
            ) : (
              <div className="px-5">
                <Link
                  className="text-white py-2 px-4 mr-4 rounded bg-slate-600"
                  to="/"
                >
                  Go to Home Page
                </Link>
                <Link
                  className="text-white py-2 px-4 rounded bg-purple-500"
                  to="/createpost"
                >
                  Create a Post
                </Link>
              </div>
            )}
            <div>
              {authState.status && <span> Hi, {authState.username}</span>}
              {authState.status && (
                <button
                  onClick={logout}
                  className="text-white py-2 px-4 ml-3 rounded bg-red-400 hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default HomePage;
