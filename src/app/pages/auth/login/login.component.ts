import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  code_user: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.showSuccess();
    if (this.authService.token && this.authService.user) {
      this.router.navigateByUrl('/');
      return;
    }
    this.activatedRoute.queryParams.subscribe((resp: any) => {
      this.code_user = resp.code;
    });
    if (this.code_user) {
      let data = { code_user: this.code_user };
      this.authService.verifiedAuth(data).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toastr.error('El enlace de verificación no es válido o ha expirado.', 'Error de Verificación');
        }
        if (resp.message == 200) {
          this.toastr.success('El enlace de verificación es válido.', 'Éxito de Verificación');
          setTimeout(() => {
            this.router.navigateByUrl("/login");
          }, 500);
        }
      });
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.error('Todos los campos son obligatorios', 'Error de autenticación');
      return;
    }
    this.authService.login(this.email, this.password).subscribe((resp: any) => {
      console.log(resp);
      if (resp.error && resp.error.error == "Unauthorized") {
        this.toastr.error('Credenciales inválidas', 'Error de autenticación');
        return;
      }
      if (resp == true) {
        this.toastr.success('Inicio de sesión exitoso', 'Éxito');
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 500);
      }
    }, (err) => {
      console.log(err);
    });
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
