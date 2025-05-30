import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service'; // Import your AuthService


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatOptionModule,
    MatIconModule,
    MatTableModule,
    
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService // Inject your AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading = true;

    try {
      const result = this.authService.login(email, password);
      this.loading = false;
      if (result) {
        this.toastr.success('Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error('Email ou senha incorretos.');
      }
    } catch (err: any) {
      this.loading = false;
      this.toastr.error(err?.message || 'Email ou senha incorretos.');
    }
  }


  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl && emailControl.hasError('required')) {
      return 'Email é obrigatório';
    }
    return emailControl && emailControl.hasError('email') ? 'Email inválido' : '';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl && passwordControl.hasError('required')) {
      return 'Senha é obrigatória';
    }
    return passwordControl && passwordControl.hasError('minlength') ? 'Senha deve ter pelo menos 6 caracteres' : '';
  }
}
