import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLoginMutation } from "../redux/Features/Auth/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

type FormValues = {
  email: string;
  password: string;
};

const Signin = () => {
    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

    const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

   const handleLogin: SubmitHandler<FormValues> = async (data) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await login(loginData).unwrap();
      const user = res.user;
      toast.success("Logged in successfully.");

      // Setting the user in Redux state
      dispatch(setUser({ user }));
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password!");
    }
  };


    return (
    <div className="max-w-[500px] mx-auto h-screen flex items-center justify-center">
      <form className="space-y-6 w-full bg-gray-100 p-6 rounded-xl" onSubmit={handleSubmit(handleLogin)}>
        <h1 className="text-2xl font-semibold text-start">Signin to access dashboard</h1>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email-address" className="">
              Email address
            </label>
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              required
              {...register('email')}
              className="appearance-none rounded-lg relative block w-full p-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Email address"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              {...register('password')}
              className="appearance-none rounded-lg relative block w-full p-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </div>
    );
};

export default Signin;