import React, { useState } from 'react';

import { useAppThunks } from './hooks';

function Header() {
  const [newTodo, setNewTodo] = useState<string>('');
  const { todomvcThunks } = useAppThunks();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value);
  }

  function handleNewTodoKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    const title = newTodo.trim();

    if (title) {
      todomvcThunks.addTodo({ title });
      setNewTodo('');
    }

    event.preventDefault();
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        aria-label="Add a new todo"
        value={newTodo}
        onKeyDown={handleNewTodoKeyDown}
        onChange={handleChange}
        autoFocus={true}
      />
    </header>
  );
}

export default Header;
