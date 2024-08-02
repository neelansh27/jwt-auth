import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  function handleClick(){
    if (user!==null){
      logout();
    }
    navigate('/auth/login');
  }
  return (
    <>
      <div>
        {user !== null && (
          <header className="w-full bg-blue-500 text-white py-3 text-xl text-center font-bold">
            Welcome <span className="capitalize">{user.name}</span>!!
          </header>
        )}
        {user !== null && (
          <h2 className="font-bold text-lg text-center my-1">Details</h2>
        )}
        {user !== null && (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 border-black border rounded-md">
              <div className="subhead rounded-tl-md border-b-black border-b">Phone Number</div>
              <div className="text-center border-b-black px-2 border-b py-3 rounded-tr-md">{user.phone}</div>
              <div className="subhead rounded-bl-md">Email</div>
              <div className="text-center py-3 px-2 rounded-br-md">{user.email}</div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
    <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
            onClick={handleClick}
          >
            Logout
          </button>
</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
