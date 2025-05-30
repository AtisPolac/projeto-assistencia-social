import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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


@Component({
  standalone: true,
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
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
    RouterModule
  ]
})
export class RecuperarSenhaComponent implements OnInit {
  recuperarForm!: FormGroup;
  loading = false;
  enviado = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.recuperarForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Aqui será implementada a integração com o serviço de recuperação de senha
    // Por enquanto, simulamos um envio bem-sucedido após 1 segundo
    setTimeout(() => {
      this.loading = false;
      this.enviado = true;
      this.snackBar.open('Instruções de recuperação enviadas para o seu email!', 'Fechar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }, 1000);
  }

  getEmailErrorMessage() {
    const emailControl = this.recuperarForm.get('email');
    if (emailControl && emailControl.hasError('required')) {
      return 'Email é obrigatório';
    }
    return emailControl && emailControl.hasError('email') ? 'Email inválido' : '';
  }

  voltarLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
