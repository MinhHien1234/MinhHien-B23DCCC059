import React from "react";
import TodoItem from "./todoitem"; 
import { Todo } from "@/models/Todolist"; 

//  Định nghĩa kiểu dữ liệu cho `props`
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

//  Thêm kiểu `React.FC<TodoListProps>`
const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  return (
    <ul>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
        ))
      ) : (
        <p>Chưa có công việc nào.</p>
      )}
    </ul>
  );
};

export default TodoList;
