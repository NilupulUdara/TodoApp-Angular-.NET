import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TodoItem, AddTodoItem, UpdateTodoItem } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/TodoItem`;

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(todo: AddTodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, todo)
      .pipe(catchError(this.handleError));
  }

  update(id: string, todo: UpdateTodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, todo)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<TodoItem> {
    return this.http.delete<TodoItem>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized';
    }
    return throwError(() => new Error(errorMessage));
  }
}