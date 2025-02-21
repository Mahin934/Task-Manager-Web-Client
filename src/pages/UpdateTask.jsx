import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateTask = ({ task, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        category: task.category,
    });

    useEffect(() => {
        setFormData({
            title: task.title,
            description: task.description,
            category: task.category,
        });
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || formData.title.length > 50) {
            Swal.fire("Error", "Title is required and must be under 50 characters.", "error");
            return;
        }
        if (formData.description.length > 200) {
            Swal.fire("Error", "Description must be under 200 characters.", "error");
            return;
        }

        try {
            const response = await axios.put(`https://task-manager-web-server.vercel.app/tasks/${task._id}`, formData);
            if (response.data.modifiedCount > 0) {
                Swal.fire("Success", "Task updated successfully!", "success");
                onUpdate(task._id, formData);  // Notify the parent to update the task in the UI
                onClose();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update task. Try again!", "error");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Update Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="Title"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="Description"
                        className="w-full px-3 py-2 border rounded-md"
                    ></textarea>
                    <input
                        type="text"
                        value={formData.category}
                        className="w-full px-3 py-2 border rounded-md bg-gray-100"
                        readOnly
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                        Update Task
                    </button>
                    <button
                        type="button"
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

export default UpdateTask;
