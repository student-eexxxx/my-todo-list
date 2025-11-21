function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ marginBottom: 8 }}>
      <input type="checkbox" checked={todo.isCompleted} onChange={() => onToggle(todo.id)} />
      <span
        style={{
          textDecoration: todo.isCompleted ? "line-through" : "none",
          marginLeft: 8,
        }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} style={{ marginLeft: 8, color: "red" }}>
        Удалить
      </button>
    </li>
  );
}

export default TodoItem;
