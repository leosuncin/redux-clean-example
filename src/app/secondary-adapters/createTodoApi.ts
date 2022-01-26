import type {
  CreateTodo,
  Todo,
  TodoApi,
  TodoId,
  UpdateTodo,
} from '../ports/todomvc';

class TodoAPI implements TodoApi {
  private readonly path;

  constructor(baseApi: string) {
    this.path = `${baseApi}/todo`;
  }

  async createTodo(newTodo: CreateTodo): Promise<Todo> {
    return this.post<Todo>(this.path, {
      ...newTodo,
      completed: false,
    });
  }

  async listTodo(signal?: AbortSignal): Promise<Todo[]> {
    return this.get<Todo[]>(new Request(this.path, { signal }));
  }

  updateTodo(todoId: TodoId, updates: UpdateTodo): Promise<Todo> {
    return this.put<Todo>(`${this.path}/${todoId}`, updates);
  }

  deleteTodo(todoId: TodoId): Promise<void> {
    return this.del(`${this.path}/${todoId}`);
  }

  private async get<T>(request: RequestInfo): Promise<T> {
    const response = await fetch(request, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response.json() as Promise<T>;
  }

  private async post<T>(
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
  }

  private async put<T>(
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

  private async del<T>(request: RequestInfo): Promise<T> {
    const response = await fetch(request, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    return response.json() as Promise<T>;
  }
}

export function createTodoApi(baseApi: string): TodoApi {
  return new TodoAPI(baseApi);
}
