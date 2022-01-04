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
