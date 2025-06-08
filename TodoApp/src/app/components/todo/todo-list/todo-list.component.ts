import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../../../core/services/todo.service';
import { TodoItem } from '../../../core/models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);

  todos: TodoItem[] = [];
  displayedColumns: string[] = ['title', 'iscompleted', 'actions'];

  showForm = false;            // Control form visibility
  selectedTodo: TodoItem | null = null;  // For editing

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAll().subscribe({
      next: (todos) => this.todos = todos,
      error: (err) => console.error(err.message)
    });
  }

  openTodoForm(todo?: TodoItem): void {
    this.selectedTodo = todo || null;
    this.showForm = true;
  }

  closeForm(success: boolean): void {
    this.showForm = false;
    this.selectedTodo = null;
    if (success) {
      this.loadTodos();
    }
  }

  deleteTodo(id: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (confirmed) {
      this.todoService.delete(id).subscribe({
        next: () => this.loadTodos(),
        error: (err) => console.error(err.message)
      });
    }
  }
}
