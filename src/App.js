import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: inputValue, isCompleted: false }]);
      setInputValue("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: 24 }}>
      <h1>Мой To-Do List</h1>
      <form onSubmit={handleAddTodo}>
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

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              marginBottom: 8,
              textDecoration: todo.isCompleted ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ marginLeft: 8 }}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 8, color: "red" }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
