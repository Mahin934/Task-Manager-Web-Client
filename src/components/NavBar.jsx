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

    const links = (
        <>
            <li>
                <NavLink
                    to="/"
                    onClick={() => setDropdownOpen(false)}
                    className={({ isActive }) =>
                        isActive
                            ? "text-white bg-blue-500 px-4 py-2 rounded-full"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full transition"
                    }
                >
                    Home
                </NavLink>
            </li>
        </>
    );

    return (
        <div className={`fixed top-0 left-0 bg-gradient-to-r from-blue-400 to-indigo-600 w-full z-50 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} shadow-md`}>
            <div className="navbar p-0 md:py-2 md:container mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        {dropdownOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 dark:bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                {links}
                            </ul>
                        )}
                    </div>
                    <a className="btn border-none text-white font-semibold md:text-2xl bg-gradient-to-r from-blue-300 via-sky-500 to-indigo-500 animate__hinge">
                        TaskNest
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal space-x-3 px-1">{links}</ul>
                </div>
                <div className="navbar-end flex gap-4">
                    {/* Dark Mode Toggle Button */}
                    <button onClick={toggleDarkMode} className="btn btn-primary px-4">
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <img className="w-10 h-10 rounded-full" src={user.photoURL || "/default-avatar.png"} alt="User Avatar" />
                            <button onClick={handleLogout} className="btn btn-primary">
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
