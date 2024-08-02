import React,{useEffect} from 'react'
import { useNavigate} from 'react-router-dom'

const Land = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/auth/signup')
  })
  return (
    <></>
  )
}

export default Land
