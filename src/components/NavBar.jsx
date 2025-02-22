import { Link, NavLink, useLocation } from "react-router-dom";
import "animate.css";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { DarkModeContext } from "../providers/DarkModeProvider";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { darkMode, setDarkMode } = useContext(DarkModeContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const handleLogout = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Logged Out",
                    text: "You have successfully logged out!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Logout failed: ${error.message}`,
                });
            });
    };


    return (
        <div className={`fixed top-0 left-0 bg-gradient-to-r from-blue-400 to-indigo-600 w-full z-50 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} shadow-md`}>
            <div className="navbar p-0 md:py-2 md:container mx-auto">
                <div className="navbar-start">
                    <a className="btn border-none text-white font-semibold md:text-2xl bg-gradient-to-r from-blue-300 via-sky-500 to-indigo-500 animate__hinge">
                        TaskNest
                    </a>
                </div>
                <div className="navbar-end flex gap-4">
                    {/* Dark Mode Toggle Button */}
                    <button onClick={toggleDarkMode} className="btn btn-primary px-3 rounded-full bg-blue-500 border-none">
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <img className="w-10 h-10 rounded-full" src={user.photoURL || "/default-avatar.png"} alt="User Avatar" />
                            <button onClick={handleLogout} className="btn btn-primary rounded-full bg-blue-500 border-none">
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="join animate__heartBeat">
                            <Link to="/register" className="btn join-item rounded-l-full btn-primary">Sign Up</Link>
                            <Link to="/login" className="btn join-item border rounded-r-full border-gray-300 text-gray-700">Log in</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
