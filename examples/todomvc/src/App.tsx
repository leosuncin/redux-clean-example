import { useEffect } from 'react';

import Footer from './ui/Footer';
import Header from './ui/Header';
import TodoList from './ui/TodoList';
import { selectors, useAppSelector, useAppThunks } from './ui/hooks';

function TodoMvc() {
  const { counter } = useAppSelector(selectors.todomvc.counter);
  const { todomvcThunks } = useAppThunks();
  const showTodoList = counter.allCount > 0;
  const showFooter = counter.activeTodoCount > 0 || counter.completedCount > 0;

  useEffect(() => {
    const promise = todomvcThunks.fetchTodoList();

    return () => {
      promise.abort();
    };
  }, [todomvcThunks]);

  return (
    <div className="todoapp">
      <Header />
      {showTodoList ? <TodoList /> : null}
      {showFooter ? <Footer /> : null}
    </div>
  );
}

export default TodoMvc;
