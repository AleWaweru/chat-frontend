import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault(); 
      const data = { username: username, password: password };
  
      axios.post("http://localhost:3001/auth/login", data).then((response) => {
        if(response.data.error){
          alert(response.data.error);
        } else{
          localStorage.setItem("accessToken", response.data.token);
          setAuthState(
            {
              username: response.data.username,
               id: response.data.id, 
               status: true
              });
          navigate("/");
        }
       
      });
    };
  
    return (
      <div className="flex justify-center w-[100%] mx-auto items-center py-[8rem]">
        <div className="bg-gray-100 p-4 rounded w-[40%] shadow-md">
          <form className="w-full mx-auto max-w-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl text-center font-bold mb-2">Login</h2>
            <div className="mb-4 w-full">
              <label  className="block text-gray-700">
                Username
              </label>
              <input
                placeholder="username..."
                type="text"
                id="username"
                name="username"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
                autoComplete="off"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Password
              </label>
              <input
                placeholder="password..."
                type="password"
                id="password"
                name="password"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
                autoComplete="off"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              LOGIN
            </button>
            <div>
              Dont have an account?
              <Link className="underline hover:text-blue-400" to="/register">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;
  