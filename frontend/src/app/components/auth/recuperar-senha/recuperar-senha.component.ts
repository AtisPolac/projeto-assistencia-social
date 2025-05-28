import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
  recuperarForm: FormGroup;
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
    if (this.recuperarForm.get('email').hasError('required')) {
      return 'Email é obrigatório';
    }
    return this.recuperarForm.get('email').hasError('email') ? 'Email inválido' : '';
  }

  voltarLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
