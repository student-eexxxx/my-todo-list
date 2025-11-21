import { useState, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./RegistrationForm";
import PostList from "./PostList";
import ImageSearchImproved from "./ImageSearchImproved";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'

  const fetchTodos = async (filterType = "all") => {
    let url = "http://localhost:5000/api/v1/todos";

    if (filterType === "active") {
      url += "?completed=false";
    } else if (filterType === "completed") {
      url += "?completed=true";
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(filter);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    fetchTodos(newFilter);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch("http://localhost:5000/api/v1/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputValue }),
        });
        const newTodo = await response.json();
        fetchTodos(filter);
        setInputValue("");
      } catch (error) {
        console.error("Ошибка добавления задачи:", error);
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: todo.text,
          isCompleted: !todo.isCompleted,
        }),
      });
      fetchTodos(filter);
    } catch (error) {
      console.error("Ошибка обновления задачи:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos(filter);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 24 }}>Загрузка задач...</div>;
  }

  return (
    <div className="App" style={{ textAlign: "center", padding: 24 }}>
      <h1>Мой To-Do List</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите задачу"
          style={{ padding: 8, width: "200px" }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Добавить
        </button>
      </form>

      <div style={{ margin: "16px 0" }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{
            marginRight: 8,
            backgroundColor: filter === "all" ? "#007bff" : "#f8f9fa",
            color: filter === "all" ? "white" : "black",
          }}
        >
          Все
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          style={{
            marginRight: 8,
            backgroundColor: filter === "active" ? "#007bff" : "#f8f9fa",
            color: filter === "active" ? "white" : "black",
          }}
        >
          Активные
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          style={{
            backgroundColor: filter === "completed" ? "#007bff" : "#f8f9fa",
            color: filter === "completed" ? "white" : "black",
          }}
        >
          Выполненные
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              marginBottom: 8,
              textDecoration: todo.isCompleted ? "line-through" : "none",
              opacity: todo.isCompleted ? 0.7 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ marginLeft: 8, marginRight: 8 }}>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                marginLeft: 8,
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 40 }}>
        <RegistrationForm />
      </div>
      <div style={{ marginTop: 40 }}>
        <PostList />
      </div>
      <ImageSearchImproved />
    </div>
  );
}

export default App;
