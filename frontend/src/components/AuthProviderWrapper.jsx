import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
function AuthProviderWrapper(props) {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState(null);
  
  // Storing JWT in local Storage
  const storeItems = (token) => {
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
    window.location.reload()
  };

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token || tokenExpired()) {
      setisLoggedIn(false);
      setloading(false);
      setuser(null);
    } else {
      fetch(import.meta.env.VITE_BACK_URL+'/verify',{
        method: 'post',
        headers: {token}
      })
        .then((res) => res.json())
        .then((res) => {
            setloading(false);
            setuser(res);
            setisLoggedIn(true);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          setisLoggedIn(false);
          setloading(false);
          setuser(null);
        });
    }
  },[])
  if (!loading){
    return (
      <AuthContext.Provider value={{ storeItems, isLoggedIn, loading, user,logout}}>
        {props.children}
      </AuthContext.Provider>
    );
  }
}
export default AuthProviderWrapper;
