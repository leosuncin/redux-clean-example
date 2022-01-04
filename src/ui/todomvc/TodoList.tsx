import { useState } from 'react';

import { Todo, TodoId } from '../../app/ports/todomvc';
import { selectors, useAppSelector, useAppThunks } from '../hooks';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [editing, setEditing] = useState<TodoId | null>(null);
  const { todos } = useAppSelector(selectors.todomvc.todos);
  const { counter } = useAppSelector(selectors.todomvc.counter);
  const { todomvcThunks } = useAppThunks();

  function handleEdit(todo: Todo) {
    return () => {
      setEditing(todo.id);
    };
  }

  function handleCancel() {
    setEditing(null);
  }

  function handleSave(todo: Todo) {
    return (text: string) => {
      todomvcThunks.update({ id: todo.id, title: text });
      setEditing(null);
    };
  }

  function handleToggleAll(event: React.ChangeEvent<HTMLInputElement>) {
    const completed = event.target.checked;
    todomvcThunks.toggleAll(completed);
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        aria-label="Toggle all"
        checked={counter.activeTodoCount === 0}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all" />
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            editing={editing === todo.id}
            todo={todo}
            onCancel={handleCancel}
            onDestroy={todomvcThunks.destroy}
            onEdit={handleEdit(todo)}
            onSave={handleSave(todo)}
            onToggle={todomvcThunks.toggle}
          />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
