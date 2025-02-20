import React from "react";
import { Todo } from "@/models/Todolist";

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="flex justify-between items-center p-2 border-b">
      <span
        className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} className="text-red-500">Xóa</button>
    </li>
  );
};

export default TodoItem;
