import React, { useState } from 'react';
import { Input, Button, List } from 'antd';

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [task, setTask] = useState('');

  const addTodo = () => {
    if (task.trim()) {
      setTodos([...todos, task]);
      setTask('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ maxWidth: 400, margin: '5', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>ToDoList</h2>
      <Input 
        value={task} 
        onChange={(e) => setTask(e.target.value)} 
        placeholder="Nhập công việc..." 
        onPressEnter={addTodo} 
      />
      <Button type="primary" onClick={addTodo} style={{ marginTop: 10, width: '100%' }}>
        Thêm
      </Button>
      <List
        bordered
        dataSource={todos}
        renderItem={(item, index) => (
          <List.Item actions={[<Button onClick={() => removeTodo(index)}>Xóa</Button>]}>
            {item}
          </List.Item>
        )}
        style={{ marginTop: 5 }}
      />
    </div>
  );
};

export default TodoPage;
