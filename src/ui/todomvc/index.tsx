import './TodoMvc.css';
import { selectors, useAppSelector } from '../hooks';
import Footer from './Footer';
import Header from './Header';
import TodoList from './TodoList';

const TodoMvc = () => {
  const { counter } = useAppSelector(selectors.todomvc.counter);
  const showTodoList = counter.allCount > 0;
  const showFooter = counter.activeTodoCount > 0 || counter.completedCount > 0;

  return (
    <div className="todoapp">
      <Header />
      {showTodoList ? <TodoList /> : null}
      {showFooter ? <Footer /> : null}
    </div>
  );
};

export default TodoMvc;
