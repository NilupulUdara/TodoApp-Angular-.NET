export interface TodoItem {
  id: string;
  title: string;
  iscompleted: boolean;
}

export type AddTodoItem = Omit<TodoItem, 'id'>;
export type UpdateTodoItem = TodoItem;