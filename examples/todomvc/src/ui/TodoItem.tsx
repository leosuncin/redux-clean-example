import classNames from 'classnames';
import { useRef, useState } from 'react';

import { Todo, TodoId } from '../app/ports/todomvc';

export interface TodoItemProps {
  editing?: boolean;
  todo: Todo;
  onCancel(): void;
  onDestroy(todoId: TodoId): void;
  onEdit(): void;
  onSave(text: string): void;
  onToggle(todoId: TodoId): void;
}

const TodoItem = ({
  editing,
  todo,
  onCancel,
  onDestroy,
  onEdit,
  onSave,
  onToggle,
}: TodoItemProps) => {
  const [editText, setEditText] = useState<string>(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const text = editText.trim();

    if (text) {
      onSave(text);
      setEditText(text);
    } else {
      onDestroy(todo.id);
    }
  }

  function handleEdit() {
    onEdit();
    setEditText(todo.title);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditText(event.target.value);
  }

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          aria-label={`Toggle ${todo.title}`}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => onDestroy(todo.id)}
          aria-label={`Remove ${todo.title}`}
        />
      </div>
      {editing && (
        <input
          ref={editField}
          className="edit"
          aria-label={`Edit ${todo.title}`}
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;
