import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import UpdateTask from "./UpdateTask";  
import AddTask from "./AddTask";  

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState({
        "To-Do": [],
        "In Progress": [],
        "Done": [],
    });

    const [taskToUpdate, setTaskToUpdate] = useState(null);  
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);  

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tasks");
            const fetchedTasks = response.data || [];
            setTasks(fetchedTasks);
            updateColumns(fetchedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
            setColumns({ "To-Do": [], "In Progress": [], "Done": [] });
        }
    };

    const updateColumns = (tasksList) => {
        const updatedColumns = { "To-Do": [], "In Progress": [], "Done": [] };
        tasksList.forEach((task) => {
            if (updatedColumns[task.category]) {
                updatedColumns[task.category].push(task);
            }
        });
        setColumns(updatedColumns);
    };

    const handleAddTask = async (newTask) => {
        try {
            await axios.post("http://localhost:5000/tasks", newTask);
            await fetchTasks(); // Immediately fetch updated data from server
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleTaskUpdate = async (taskId, updatedData) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedData);
            await fetchTasks(); // Fetch latest data from server
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteClick = async (taskId) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5000/tasks/${taskId}`);
                await fetchTasks(); // Fetch latest tasks after deletion
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const sourceColumn = source.droppableId;
        const destColumn = destination.droppableId;

        if (sourceColumn === destColumn && source.index === destination.index) return;

        try {
            const movedTask = columns[sourceColumn][source.index];
            await axios.put(`http://localhost:5000/tasks/${movedTask._id}`, { category: destColumn });
            await fetchTasks(); // Fetch updated tasks
        } catch (error) {
            console.error("Error updating task category:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="relative">
                <button onClick={() => setIsAddTaskModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg">
                    Add New Task
                </button>
            </div>

            {isAddTaskModalOpen && (
                <AddTask onClose={() => setIsAddTaskModalOpen(false)} onAdd={handleAddTask} />
            )}

            {isModalOpen && taskToUpdate && (
                <UpdateTask
                    task={taskToUpdate}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleTaskUpdate}
                />
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 justify-between mt-10">
                    {Object.keys(columns).map((columnKey) => (
                        <Droppable key={columnKey} droppableId={columnKey}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-bold mb-4 text-center">{columnKey}</h2>
                                    {columns[columnKey].map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-3 mb-3 rounded-md shadow">
                                                    <h3 className="font-bold text-blue-600">{task.title}</h3>
                                                    <p>{task.description}</p>
                                                    <small className="text-gray-500">{new Date(task.timestamp).toLocaleString()}</small>
                                                    <div className="space-x-3">
                                                        <button
                                                            onClick={() => setTaskToUpdate(task) || setIsModalOpen(true)}
                                                            className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-md items-center justify-center"
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(task._id)}
                                                            className="mt-2 bg-red-500 text-white px-3 py-2 rounded-md items-center justify-center"
                                                        >
                                                            <FiTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Home;
