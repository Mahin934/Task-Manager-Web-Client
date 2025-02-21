import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://task-manager-web-server.vercel.app/tasks");
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);
        categorizeTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const categorizeTasks = (tasks) => {
    const categorized = {
      "To-Do": [],
      "In Progress": [],
      "Done": [],
    };
    tasks.forEach((task) => {
      categorized[task.category].push(task);
    });
    setColumns(categorized);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const newColumns = { ...columns };

    const [movedTask] = newColumns[sourceColumn].splice(source.index, 1);
    newColumns[destColumn].splice(destination.index, 0, movedTask);

    setColumns(newColumns);
  };

  return (
    <div className="tasks-container" style={{ padding: "2rem", background: "#e3f2fd", minHeight: "100vh" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container" style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
          {Object.keys(columns).map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: "32%",
                    background: "linear-gradient(135deg, #64b5f6, #1e88e5)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    color: "white",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <h2 style={{ textAlign: "center", marginBottom: "1rem", textTransform: "uppercase" }}>{column}</h2>
                  {columns[column].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: "#ffffff",
                            color: "#333",
                            padding: "1.2rem",
                            marginBottom: "1rem",
                            borderRadius: "10px",
                            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
                            transition: "transform 0.2s ease",
                            cursor: "grab",
                          }}
                        >
                          <h3 style={{ color: "#1e88e5" }}>{task.title}</h3>
                          <p>{task.description}</p>
                          <small style={{ color: "#616161" }}>{new Date(task.timestamp).toLocaleString()}</small>
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

export default Tasks;
