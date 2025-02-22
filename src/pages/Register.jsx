import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import registerLottie from "../assets/lottie/signUp.json";
import Lottie from "lottie-react";
import axios from "axios";
import { DarkModeContext } from "../providers/DarkModeProvider";


const Register = () => {
    const { createNewUser, setUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
    const { darkMode } = useContext(DarkModeContext); // Get darkMode from context

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get("name");
        const photo = form.get("photo");
        const email = form.get("email");
        const password = form.get("password");

        // Password validation
        if (!/[A-Z]/.test(password)) {
            setErrorMessage("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setErrorMessage("Password must contain at least one lowercase letter.");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        // Clear error message if validation passes
        setErrorMessage("");

        try {
            // Register user in Firebase
            const result = await createNewUser(email, password);
            const user = result.user;
            setUser(user);
            await updateUserProfile({
                displayName: name,
                photoURL: photo,
            });

            // Send email and display name to MongoDB
            await axios.post("https://task-manager-web-server.vercel.app/users", {
                email,
                name,
            });

            navigate("/"); // Redirect to the homepage
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Google Sign-In Handler
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then((result) => {
                const user = result.user;
                setUser(user);
                navigate("/"); // Redirect to the homepage after successful login
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center py-20 gap-10 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} min-h-screen`}>
            {/* Register Form */}
            <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 ${darkMode ? 'text-white' : ''}`}>
                <h1 className={`text-3xl font-semibold text-center ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Create Your Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name input */}
                    <div className="space-y-1">
                        <label className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-700' : 'focus:ring-indigo-500'}`}
                            required
                        />
                    </div>

                    {/* Photo URL input */}
                    <div className="space-y-1">
                        <label className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Photo URL</label>
                        <input
                            type="text"
                            name="photo"
                            placeholder="Your Photo URL"
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-700' : 'focus:ring-indigo-500'}`}
                            required
                        />
                    </div>

                    {/* Email input */}
                    <div className="space-y-1">
                        <label className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-700' : 'focus:ring-indigo-500'}`}
                            required
                        />
                    </div>

                    {/* Password input with toggle */}
                    <div className="space-y-1">
                        <label className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-700' : 'focus:ring-indigo-500'} pr-10`}
                                required
                            />
                            <span
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Display error message if exists */}
                    {errorMessage && (
                        <p className="text-red-500 text-xs text-center">{errorMessage}</p>
                    )}

                    {/* Submit button */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 ${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'} text-white font-semibold rounded-md shadow-lg hover:${darkMode ? 'bg-indigo-600' : 'bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Google Sign-In button */}
                    <div>
                        <button
                            onClick={handleGoogleSignIn}
                            className={`w-full py-3 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white font-semibold rounded-md shadow-lg hover:${darkMode ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Sign Up with Google
                        </button>
                    </div>

                    <p className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Already have an account?{" "}
                        <Link className={`text-indigo-600 ${darkMode ? 'text-indigo-400' : ''}`} to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            {/* Lottie Animation */}
            <div className="w-full md:w-1/2 flex justify-center">
                <Lottie animationData={registerLottie} style={{ maxWidth: "700px" }} />
            </div>
        </div>
    );
};

export default Register;
