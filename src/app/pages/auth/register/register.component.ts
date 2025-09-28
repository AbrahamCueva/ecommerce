import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  register() {
    if (!this.name || !this.surname || !this.email || !this.phone || !this.password) {
      this.toastr.error('Por favor, completa todos los campos.', 'Error de Registro');
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    this.authService.register(data).subscribe((resp: any) => {
      this.toastr.success('Revisa tu correo electrónico para completar el registro.', 'Éxito');
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
    });
  }
}
