import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
function AuthProviderWrapper(props) {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState(null);

  // Storing JWT in local Storage
  const storeItems = async (token) => {
    localStorage.removeItem("token");
    localStorage.removeItem("timestamp");
    localStorage.setItem("token", token);
    localStorage.setItem("timestamp", Date.now());
  };

  // Checking if token has Expired
  const tokenExpired = () => {
    const token = localStorage.getItem("token");
    const timestamp = localStorage.getItem("timestamp");

    if (!token || !timestamp) {
      return false;
    }

    const timePassed = Date.now() - Number(timestamp);
    // Token is valid for 1 day
    return timePassed > 1000*60*60*24;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("timestamp");
    setuser(null);
    setisLoggedIn(false);
    setloading(false);
  };

  async function verify(token){
    const res = await fetch(import.meta.env.VITE_BACK_URL+'/verify',{
      method: 'post',
      headers: {token}
    })
    const data = await res.json()
    if (data) {
      setuser(data)
      setisLoggedIn(true);
    } else {
      console.log(JSON.stringify(err));
      setuser(null);
      setisLoggedIn(false);
    }
    setloading(false);
  }
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token || tokenExpired()) {
      setuser(null);
      setisLoggedIn(false);
      setloading(false);
    } else {
      verify(token)
    }
  },[])
  if (!loading)
    return (
      <AuthContext.Provider value={{ storeItems, isLoggedIn, loading, user,verify,logout}}>
      {props.children}
      </AuthContext.Provider>
    );
}
export default AuthProviderWrapper;
