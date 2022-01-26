declare const entity: unique symbol;

export type Opaque<IdType, EntityName> = IdType & {
  readonly [entity]: EntityName;
};

export type TodoId = Opaque<number, 'Todo'>;

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
}

export type CreateTodo = Pick<Todo, 'title'>;

export type UpdateTodo = Pick<Todo, 'title' | 'completed'>;

export interface TodoApi {
  createTodo(newTodo: CreateTodo): Promise<Todo>;
  listTodo(signal?: AbortSignal): Promise<Todo[]>;
  updateTodo(todoId: TodoId, updates: UpdateTodo): Promise<Todo>;
  deleteTodo(todoId: TodoId): Promise<void>;
}
