import { useState } from "react";

export default function Login({ onLogin }) {
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
        onLogin(data.token);
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
}
