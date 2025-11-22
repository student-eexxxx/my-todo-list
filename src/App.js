import { useState, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./RegistrationForm";
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

  // Функция для обновления access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return null;
      }

      const response = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        return data.accessToken;
      } else {
        handleLogout();
        return null;
      }
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      handleLogout();
      return null;
    }
  };

  // Универсальная функция для API запросов с авто-обновлением токена
  const apiRequest = async (url, options = {}) => {
    let token = localStorage.getItem("token");

    const requestOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    let response = await fetch(url, requestOptions);

    // Если токен просрочен, пробуем обновить
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Повторяем запрос с новым токеном
        requestOptions.headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(url, requestOptions);
      }
    }

    return response;
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

  const fetchTodos = async (filterType = "all") => {
    let url = "http://localhost:5000/api/v1/todos";

    if (filterType === "active") {
      url += "?completed=false";
    } else if (filterType === "completed") {
      url += "?completed=true";
    }

    try {
      const response = await apiRequest(url);

      if (response.status === 401) {
        return;
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
    setShowLogin(false);
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
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const response = await apiRequest("http://localhost:5000/api/v1/todos", {
          method: "POST",
          body: JSON.stringify({ text: inputValue }),
        });

        await response.json();
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
      await apiRequest(`http://localhost:5000/api/v1/todos/${id}`, {
        method: "PUT",
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
      await apiRequest(`http://localhost:5000/api/v1/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos(filter);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    fetchTodos(newFilter);
  };

  // Обновляем компоненты Login и Register для работы с двумя токенами
  const CustomLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          handleLoginSuccess(data.accessToken, data.refreshToken);
        } else {
          alert(data.error || "Ошибка входа");
        }
      } catch (error) {
        console.error("Ошибка входа:", error);
      }
    };

    return (
      <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: 10, padding: 8, marginBottom: 10, display: "block" }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: 10, padding: 8, marginBottom: 10, display: "block" }}
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  };

  if (loading && isAuthenticated) {
    return <div style={{ textAlign: "center", padding: 24 }}>Загрузка задач...</div>;
  }

  return (
    <div className="App" style={{ textAlign: "center", padding: 24 }}>
      <h1>Мой To-Do List</h1>

      {/* Кнопки авторизации */}
      {!isAuthenticated ? (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowLogin(true)} style={{ marginRight: 10 }}>
            Войти
          </button>
          <button onClick={() => setShowRegister(true)}>Регистрация</button>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <span style={{ marginRight: 10 }}>Вы авторизованы</span>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}

      {/* Компонент логина */}
      {showLogin && <CustomLogin />}

      {/* Компонент регистрации */}
      {showRegister && <Register onSwitchToLogin={handleRegisterSuccess} />}

      {/* Todo-лист (только для авторизованных) */}
      {isAuthenticated ? (
        <>
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
        </>
      ) : (
        <div style={{ marginTop: 20 }}>
          <p>Войдите или зарегистрируйтесь чтобы управлять задачами</p>
        </div>
      )}

      {/* Остальные компоненты (доступны всем) */}
      <div style={{ marginTop: 40 }}>
        <PostList />
      </div>
      <ImageSearchImproved />
    </div>
  );
}

export default App;
