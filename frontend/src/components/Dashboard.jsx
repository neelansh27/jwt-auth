import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Dashboard = ()=>{
  const {user, logout} = useContext(AuthContext);
  return (
    <>
    {JSON.stringify(user)}
    <button onClick={logout}>Logout</button>
    </>
  )
}

export default Dashboard
