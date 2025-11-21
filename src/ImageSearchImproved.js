import { useState, useEffect } from "react";

export default function ImageSearchImproved() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=V1StGXR8_ZSw7pXr7L4r3Kd5d1nQx5qK8y6v1X7z9c8`
      );

      const data = await response.json();
      setImages(data.results);

      setHistory((prev) => {
        const newHistory = [query, ...prev.filter((q) => q !== query)];
        return newHistory.slice(0, 5);
      });
    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Поиск изображений</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите запрос..."
        />
        <button type="submit">Найти</button>
      </form>

      <div style={{ marginTop: 10 }}>
        {history.map((item) => (
          <button key={item} onClick={() => setQuery(item)} style={{ marginRight: 5 }}>
            {item}
          </button>
        ))}
      </div>

      {loading && <p>Загрузка изображений...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
          marginTop: 20,
        }}
      >
        {images.map((img) => (
          <img
            key={img.id}
            src={img.urls.small}
            alt={typeof img.alt_description === "string" ? img.alt_description : "Изображение"}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}
