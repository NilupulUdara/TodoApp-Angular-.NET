import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../core/services/todo.service';
import { TodoItem } from '../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  @Input() data: TodoItem | null = null; 
  @Output() formSubmit = new EventEmitter<boolean>();

  todoForm: FormGroup;
  isEdit: boolean;

  constructor() {
    // Initialize form with empty controls
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      iscompleted: [false],
    });

    this.isEdit = false;
  }

  ngOnChanges() {
    // When input 'data' changes, update form and edit state
    if (this.data) {
      this.isEdit = true;
      this.todoForm.patchValue({
        title: this.data.title,
        iscompleted: this.data.iscompleted,
      });
    } else {
      this.isEdit = false;
      this.todoForm.reset({ title: '', iscompleted: false });
    }
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const todo = this.todoForm.value as TodoItem;

      if (this.isEdit && this.data) {
        this.todoService.update(this.data.id, { ...todo, id: this.data.id }).subscribe({
          next: () => this.formSubmit.emit(true),
          error: (err) => console.error(err.message),
        });
      } else {
        this.todoService.create(todo).subscribe({
          next: () => this.formSubmit.emit(true),
          error: (err) => console.error(err.message),
        });
      }
    }
  }

  cancel(): void {
    this.formSubmit.emit(false);
  }
}
