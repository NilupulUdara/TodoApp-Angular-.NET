import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'todos',
    loadComponent: () => import('./components/todo/todo-list/todo-list.component').then(m => m.TodoListComponent),
    canActivate: [authGuard]
  }
];
