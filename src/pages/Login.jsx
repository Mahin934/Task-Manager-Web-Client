import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginLottie from "../assets/lottie/login.json";
import Lottie from "lottie-react";
import { DarkModeContext } from "../providers/DarkModeProvider";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
    const { darkMode } = useContext(DarkModeContext);
    const { userLogin, setUser, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");

        userLogin(email, password)
            .then((result) => {
                const user = result.user;
                setUser(user);
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                navigate(location?.state || "/");
            })
            .catch((error) => {
                toast.error(`Login failed: ${error.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                });
            });
    };

    const handleGoogleLogin = () => {
        googleSignIn()
            .then((result) => {
                const user = result.user;
                setUser(user);
                toast.success("Google login successful!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                navigate(location?.state || "/");
            })
            .catch((error) => {
                toast.error(`Google login failed: ${error.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                });
            });
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center py-20 gap-10 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`flex justify-center py-28 ${darkMode ? 'text-white' : 'text-black'}`}>
                <div className={`w-full max-w-sm p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h1 className={`text-center text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Login to your account</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email input */}
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password input with toggle */}
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                                    required
                                />
                                <span
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="text-right mt-1">
                                <Link
                                    to={`/forgot-password?email=${email}`}
                                    className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="mt-6">
                            <button type="submit" className={`w-full py-2 rounded-md text-white ${darkMode ? 'bg-gray-600' : 'bg-[#403F3F]'} hover:bg-opacity-80 focus:outline-none`}>
                                Login
                            </button>
                        </div>

                        {/* Google Login Button */}
                        <div className="mt-4">
                            <button
                                type="button"
                                className={`w-full py-2 rounded-md text-white ${darkMode ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-400 focus:outline-none`}
                                onClick={handleGoogleLogin}
                            >
                                Login with Google
                            </button>
                        </div>

                        <p className={`text-center pt-4 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Don’t Have An Account?{" "}
                            <Link className={`text-red-500 ${darkMode ? 'hover:text-red-300' : 'hover:text-red-700'}`} to="/register">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />

            {/* Lottie Animation */}
            <div className="w-full md:w-1/2 flex justify-center">
                <Lottie animationData={loginLottie} style={{ maxWidth: "500px" }} />
            </div>
        </div>
    );
};

export default Login;
