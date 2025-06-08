import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup<{
    username: import('@angular/forms').FormControl<string | null>;
    password: import('@angular/forms').FormControl<string | null>;
    roles: import('@angular/forms').FormControl<string[] | null>;
  }>;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  availableRoles = ['Writer', 'Reader'];
  isSubmitting = false;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [['Reader'], [Validators.required, this.minRolesValidator(1)]]
    });
  }

  minRolesValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const roles = control.value as string[];
      return roles && roles.length >= min ? null : { minRoles: true };
    };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;
      this.successMessage = null;
      const formValue = this.registerForm.value as { username: string; password: string; roles: string[] };
      const request: RegisterRequest = {
        Username: formValue.username,
        Password: formValue.password,
        Roles: formValue.roles || []
      };

      this.authService.register(request).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registration successful!';
          this.registerForm.reset({ username: '', password: '', roles: ['Reader'] });
          setTimeout(() => {
            this.router.navigate(['login']).then(success => {
              console.log('Navigation to /login:', success ? 'succeeded' : 'failed');
              if (!success) {
                this.errorMessage = 'Navigation to login failed. Please try again.';
              }
            });
          }, 2000);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.errorMessage = err.message || 'Registration failed.';
          this.isSubmitting = false;
        },
        complete: () => {
          console.log('Registration request completed');
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Please correct the errors above.';
    }
  }
}