import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

const ResetPass = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const newPassword = watch("newPassword", "");
  const [params,setParams] = useSearchParams();
  const [err,setErr] = useState("");
  const [notify, setNotify] = useState("")

  const onSubmit = (data) => {
    fetch(import.meta.env.VITE_BACK_URL+'/reset_verify',{
      method:'post',
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        token: params.get('token'),
        id: params.get('id'),
        password: data.newPassword
      })
    })
      .then(res=>res.json())
      .then(res=>{
        console.log(res)
        if (res.error){
          setErr(res.error.message);
          setNotify("")
        } else {
          setErr("");
          setNotify("Password changed");
        }
      }).catch(err=>console.log(err))

  };

  // validation function to check if passwords match
  const validatePasswordMatch = (value) => {
    return value === newPassword || "Passwords do not match";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Change Password
        </h2>
          {err && <div className="text-red-500 text-center mb-4">{err}</div> }
          {notify && <div className="text-green-500 text-center mb-4">{notify}</div> }
        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            {...register("newPassword", { 
              required: 'This field is required',
              minLength: {value: 8, message: 'Password must be atleast 8 characters'},
              maxLength: {value: 20, message: 'Password should be at max 20 characters'}
            })}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
          />
          {errors.newPassword && (
            <span className="text-red-500">
            {errors.newPassword.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: validatePasswordMatch,
            })}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
