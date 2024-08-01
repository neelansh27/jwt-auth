import {useContext, useEffect} from "react"
import {AuthContext} from "../context/authContext"
import {useNavigate} from "react-router-dom"
const Restricted = (props) => {
  const navigate = useNavigate()
  const {isLoggedIn,loading} = useContext(AuthContext)
  useEffect(()=>{
    if (!isLoggedIn && !loading){
      navigate("/auth/login")
    }
  },[isLoggedIn,loading])
  return props.children;
}

export default Restricted
