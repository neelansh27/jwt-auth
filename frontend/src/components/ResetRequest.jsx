import React,{useState} from "react";
import { useForm } from "react-hook-form";

const ResetRequest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState("");
  const onSubmit = (data) => {
    fetch(import.meta.env.VITE_BACK_URL+'/reset_pass',{
      method:'post',
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: data.email
      })
    })
      .then(res=>res.json())
      .then(res=>{
        if (res.error){
          setErr(res.error.message);
        } else {
          setSent(true);
        }
      })
      .catch(err=>console.log(err));
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    {!sent && <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Password Change Request
        </h2>
          {err && <div className="text-red-500 text-center mb-4">{err}</div> }
        <div className="mb-4">
          <label className="block text-gray-700">
            Registered Email Address:
          </label>
          <input
            type="email"
            {...register("email", {required: "Email is required"})}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Send Password Reset Link
        </button>
      </form>}
    {sent && 
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Password Change Request
          </h2>
        <div className="text-center text-green-500">Link is sent on your email, check your inbox</div>
        </div>
    }
    </div>
  );
};

export default ResetRequest;
