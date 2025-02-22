import { useState, useContext } from "react";
import { DarkModeContext } from "../providers/DarkModeProvider";

const AddTask = ({ onClose, onAdd }) => {
    const { darkMode } = useContext(DarkModeContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategorySelect = (category) => {
        setFormData((prevData) => ({
            ...prevData,
            category: category,
        }));
        setIsDropdownOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title && formData.description && formData.category) {
            const taskWithTimestamp = { ...formData, timestamp: new Date().toISOString() };
            onAdd(taskWithTimestamp);
            setFormData({
                title: "",
                description: "",
                category: "",
            });
            onClose();
        } else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} p-6 rounded-lg shadow-xl w-96`}>
                <h2 className="text-xl font-bold mb-4">Add Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="Title"
                        className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="Description"
                        className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                    />
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            type="button"
                            className={`w-full px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
                        >
                            {formData.category || "Select Category"}
                        </button>
                        {isDropdownOpen && (
                            <div className={`absolute left-0 mt-2 w-full rounded-md shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                                {["To-Do", "In Progress", "Done"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`block w-full px-4 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md"
                    >
                        Add Task
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full mt-2 bg-gray-400 text-white py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
