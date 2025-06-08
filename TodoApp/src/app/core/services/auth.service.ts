import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(`${environment.apiUrl}/Auth/Register`, request, { observe: 'response', responseType: 'text' })
      .pipe(
        tap(response => console.log('Register response:', response)),
        map((response: HttpResponse<string>) => response.body as string),
        catchError(this.handleError)
      );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/Login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem('jwtToken', response.jwtToken);
          this.tokenSubject.next(response.jwtToken);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthService error:', {
      status: error.status,
      error: error.error,
      message: error.message
    });
    let errorMessage = 'An error occurred';

    if (error.status === 0) {
      errorMessage = 'Cannot connect to the server. Check your network.';
    } else if (error.error) {
      if (error.error.Errors) {
        errorMessage = error.error.Errors.join(' ');
      } else if (error.error.Message) {
        errorMessage = error.error.Message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}