import React, { useContext,useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  // using useForm hook to make forms
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Importing function to store the token
  const {storeItems} = useContext(AuthContext);

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch(import.meta.env.VITE_BACK_URL+'/login',{
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone:data.phone,
        password:data.password,
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error){
          setErr(res.error.message);
        } else {
          // If there are no error, store the token and redirect
          storeItems(res.token);
          navigate('/home');
        }
      })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Login
        </h2>
          {err && <div className="text-red-500 text-center mb-4">{err}</div> }
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
          />
          {errors.phone && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
          />
          {errors.password && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
