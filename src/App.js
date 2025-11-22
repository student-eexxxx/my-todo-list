import { useState, useEffect } from "react";
import "./App.css";
import PostList from "./PostList";
import ImageSearchImproved from "./ImageSearchImproved";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Базовый URL для API (работает и локально и на продакшене)
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://your-backend-url.railway.app/api"
      : "http://localhost:5000/api";

  // Функция для API запросов
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const requestOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      return response;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  };

  // Проверяем токены при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      setIsAuthenticated(true);
      fetchTodos(filter);
    } else {
      setLoading(false);
    }
  }, []);

  // Загрузка задач
  const fetchTodos = async (filterType = "all") => {
    let url = `${API_BASE}/v1/todos`;

    if (filterType === "active") {
      url += "?completed=false";
    } else if (filterType === "completed") {
      url += "?completed=true";
    }

    try {
      const response = await apiRequest(url);

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTodos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowRegister(false);
    fetchTodos(filter);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setTodos([]);
    setShowLogin(false);
    setShowRegister(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const response = await apiRequest(`${API_BASE}/v1/todos`, {
          method: "POST",
          body: JSON.stringify({ text: inputValue }),
        });

        if (response.ok) {
          await fetchTodos(filter);
          setInputValue("");
        }
      } catch (error) {
        console.error("Ошибка добавления задачи:", error);
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const response = await apiRequest(`${API_BASE}/v1/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          text: todo.text,
          isCompleted: !todo.isCompleted,
        }),
      });

      if (response.ok) {
        await fetchTodos(filter);
      }
    } catch (error) {
      console.error("Ошибка обновления задачи:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await apiRequest(`${API_BASE}/v1/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTodos(filter);
      }
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    fetchTodos(newFilter);
  };

  if (loading && isAuthenticated) {
    return <div style={{ textAlign: "center", padding: 24 }}>Загрузка задач...</div>;
  }

  return (
    <div className="App" style={{ textAlign: "center", padding: 24 }}>
      <h1>Мой To-Do List</h1>

      {/* Кнопки авторизации */}
      {!isAuthenticated && !showLogin && !showRegister && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
            style={{ marginRight: 10, padding: "10px 20px" }}
          >
            Войти
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
            style={{ padding: "10px 20px" }}
          >
            Регистрация
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div style={{ marginBottom: 20 }}>
          <span style={{ marginRight: 10 }}>Вы авторизованы</span>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}

      {/* Форма логина */}
      {showLogin && (
        <Login
          onLogin={handleLoginSuccess}
          API_BASE={API_BASE}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Форма регистрации */}
      {showRegister && (
        <Register
          onSwitchToLogin={handleRegisterSuccess}
          API_BASE={API_BASE}
          onClose={() => setShowRegister(false)}
        />
      )}

      {/* Основное приложение */}
      {!showLogin && !showRegister && (
        <>
          {isAuthenticated ? (
            <>
              <form onSubmit={addTodo}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Введите задачу"
                  style={{ padding: 8, width: "200px", marginRight: 8 }}
                />
                <button type="submit">Добавить</button>
              </form>

              <div style={{ margin: "16px 0" }}>
                <button
                  onClick={() => handleFilterChange("all")}
                  style={{
                    marginRight: 8,
                    backgroundColor: filter === "all" ? "#007bff" : "#f8f9fa",
                    color: filter === "all" ? "white" : "black",
                    padding: "8px 16px",
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
                    padding: "8px 16px",
                  }}
                >
                  Активные
                </button>
                <button
                  onClick={() => handleFilterChange("completed")}
                  style={{
                    backgroundColor: filter === "completed" ? "#007bff" : "#f8f9fa",
                    color: filter === "completed" ? "white" : "black",
                    padding: "8px 16px",
                  }}
                >
                  Выполненные
                </button>
              </div>

              <ul style={{ listStyle: "none", padding: 0, maxWidth: "500px", margin: "0 auto" }}>
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    style={{
                      marginBottom: 8,
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      textDecoration: todo.isCompleted ? "line-through" : "none",
                      opacity: todo.isCompleted ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => toggleTodo(todo.id)}
                      style={{ marginRight: "8px" }}
                    />
                    <span style={{ flex: 1, textAlign: "left" }}>{todo.text}</span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px 8px",
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div style={{ marginTop: 20 }}>
              <p>Войдите или зарегистрируйтесь чтобы управлять задачами</p>
            </div>
          )}

          {/* Остальные компоненты */}
          <div style={{ marginTop: 40 }}>
            <PostList />
          </div>
          <ImageSearchImproved />
        </>
      )}
    </div>
  );
}

export default App;
