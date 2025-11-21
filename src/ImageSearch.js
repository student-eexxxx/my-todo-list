import { useState } from "react";

export default function ImageSearch() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Поиск изображений</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите запрос..."
          style={{ padding: 8, width: 200 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Найти
        </button>
      </form>

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
            alt={img.alt_description || "Изображение"}
            style={{ width: "100%", borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}
