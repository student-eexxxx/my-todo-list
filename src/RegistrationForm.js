import { useState } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не короче 6 символов";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращает перезагрузку страницы
    if (validate()) {
      alert(`Регистрация успешна!\nДобро пожаловать, ${formData.name}!`);
      // В реальном приложении здесь был бы запрос на сервер
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <div>
        <label>Имя:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>

      <div>
        <label>Пароль:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
