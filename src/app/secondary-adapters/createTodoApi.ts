import type {
  Todo,
  TodoApi,
} from '../ports/todomvc';

export function createTodoApi(
  params: {
    baseApi: string;
  }
): TodoApi {

  const { baseApi } = params;

  const path = `${baseApi}/todo`;

  async function post<T>(
    request: RequestInfo,
    body: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json() as Promise<T>;
  };

  async function del<T>(request: RequestInfo): Promise<T> {
    const response = await fetch(request, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    return response.json() as Promise<T>;
  }

  async function put<T>(
    request: RequestInfo,
    body: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(request, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json() as Promise<T>;
  }

  async function get<T>(request: RequestInfo): Promise<T> {
    const response = await fetch(request, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response.json() as Promise<T>;
  }

  return {
    createTodo: newTodo =>
      post<Todo>(path, {
        ...newTodo,
        completed: false,
      }),
    deleteTodo: todoId => del(`${path}/${todoId}`),
    listTodo: signal => get<Todo[]>(new Request(path, { signal })),
    updateTodo: (todoId, updates) => put<Todo>(`${path}/${todoId}`, updates)
  };

}

