import { useState, useEffect } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Вариант с fetch — как в задании
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // выполняется один раз при загрузке компонента

  if (loading) {
    return <p>Загрузка постов...</p>;
  }

  return (
    <div>
      <h2>Последние посты</h2>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            style={{ marginBottom: 20, textAlign: "left", maxWidth: 600, margin: "0 auto" }}
          >
            <strong>{post.title}</strong>
            <p style={{ marginTop: 4 }}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
