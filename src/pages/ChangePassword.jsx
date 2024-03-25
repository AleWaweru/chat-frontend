import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    const changePassword = ()=>{
        axios.put("http://localhost:3001/auth/changepassword", {
            oldPassword: oldPassword,
            newPassword: newPassword,
        }, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then((response)=>{
            if(response.data.error){
                alert(response.data.error)
            }else{
                alert("Password Updated SuccessFully");
                navigate("/login");

            }
        })
    };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
    <h1 className="text-2xl font-bold mb-4">Change Password</h1>
    <div className='block'>
      <input 
      onChange={(e)=>{setOldPassword(e.target.value)}}
        type='password' 
        placeholder='Old Password...'
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <input 
      onChange={(e)=>{setNewPassword(e.target.value)}}
        type='password' 
        placeholder='New Password...'
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <button 
      onClick={changePassword}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Changes
      </button>
    </div>
  </div>
  
  )
}

export default ChangePassword;