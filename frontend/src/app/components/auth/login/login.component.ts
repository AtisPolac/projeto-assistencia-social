import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Aqui será implementada a integração com o serviço de autenticação
    // Por enquanto, simulamos um login bem-sucedido após 1 segundo
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  getEmailErrorMessage() {
    if (this.loginForm.get('email').hasError('required')) {
      return 'Email é obrigatório';
    }
    return this.loginForm.get('email').hasError('email') ? 'Email inválido' : '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm.get('password').hasError('required')) {
      return 'Senha é obrigatória';
    }
    return this.loginForm.get('password').hasError('minlength') ? 'Senha deve ter pelo menos 6 caracteres' : '';
  }
}
