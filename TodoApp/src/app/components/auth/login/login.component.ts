import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.loginForm.valid) {
      const request: LoginRequest = this.loginForm.value as LoginRequest;
      this.authService.login(request).subscribe({
        next: () => this.router.navigate(['/todos']),
        error: (err) => this.errorMessage = err.message
      });
    }
  }

  
}