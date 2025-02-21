
import { Link } from "react-router-dom";
import errorImage from '../assets/404.gif'; 

const Errorpage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <img 
                src={errorImage} 
                alt="Error Page"
                className="w-5/6 h-5/6" 
            />
            <Link to="/">
                <button className="mt-6 px-6 py-2 bg-[#403F3F] text-white font-semibold rounded-md hover:bg-[#6e6d6d] transition">
                    Go Back to Home
                </button>
            </Link>
        </div>
    );
};

export default Errorpage;
