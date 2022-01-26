import classNames from 'classnames';

import { Filter } from '../app/use-cases/todomvc';
import { selectors, useAppSelector, useAppThunks } from './hooks';

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}

function Footer() {
  const { counter } = useAppSelector(selectors.todomvc.counter);
  const { filter } = useAppSelector(selectors.todomvc.filter);
  const { todomvcThunks } = useAppThunks();
  const activeTodoWord = pluralize(counter.activeTodoCount, 'item');

  function handleChangeFilter(event: React.MouseEvent<HTMLAnchorElement>) {
    const link: HTMLAnchorElement = event.target as HTMLAnchorElement;

    switch (link.hash) {
      case '#/active':
        todomvcThunks.changeFilter(Filter.ACTIVE_TODOS);
        break;
      case '#/completed':
        todomvcThunks.changeFilter(Filter.COMPLETED_TODOS);
        break;
      default:
        todomvcThunks.changeFilter(Filter.ALL_TODOS);
        break;
    }

    event.preventDefault();
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{counter.activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({
              selected: filter === Filter.ALL_TODOS,
            })}
            onClick={handleChangeFilter}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="#/active"
            className={classNames({
              selected: filter === Filter.ACTIVE_TODOS,
            })}
            onClick={handleChangeFilter}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({
              selected: filter === Filter.COMPLETED_TODOS,
            })}
            onClick={handleChangeFilter}
          >
            Completed
          </a>
        </li>
      </ul>
      {counter.completedCount > 0 ? (
        <button
          className="clear-completed"
          onClick={() => todomvcThunks.clearCompleted()}
        >
          Clear completed
        </button>
      ) : null}
    </footer>
  );
}

export default Footer;
