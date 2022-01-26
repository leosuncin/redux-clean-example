import { useEffect } from 'react';

import { selectors, useAppSelector, useAppThunks } from './ui/hooks';
import Footer from './ui/Footer';
import Header from './ui/Header';
import TodoList from './ui/TodoList';

const TodoMvc = () => {
  const { counter } = useAppSelector(selectors.todomvc.counter);
  const { todomvcThunks } = useAppThunks();
  const showTodoList = counter.allCount > 0;
  const showFooter = counter.activeTodoCount > 0 || counter.completedCount > 0;

  useEffect(() => {
    const promise = todomvcThunks.fetchTodoList();

    return () => {
      promise.abort();
    };
  }, []);

  return (
    <div className="todoapp">
      <Header />
      {showTodoList ? <TodoList /> : null}
      {showFooter ? <Footer /> : null}
    </div>
  );
};

export default TodoMvc;
