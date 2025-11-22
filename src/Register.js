import { useState } from "react";

export default function Register({ onSwitchToLogin, API_BASE, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Регистрация успешна! Теперь войдите.");
        onSwitchToLogin();
      } else {
        alert(data.error || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2 style={{ margin: 0 }}>Регистрация</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            marginBottom: 10,
            display: "block",
            width: "100%",
            boxSizing: "border-box",
          }}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 10,
            marginBottom: 15,
            display: "block",
            width: "100%",
            boxSizing: "border-box",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Зарегистрироваться
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Уже есть аккаунт? Войти
        </button>
      </form>
    </div>
  );
}
