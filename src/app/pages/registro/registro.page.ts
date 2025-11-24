import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  usuario: any = {
    nombreUsuario: "",
    nombre: "",
    email: "",
    contrasena: ""
  }

  field: string = "";
  emailInvalido: boolean = false;
  errorRegistro: boolean = false;
  mensajeError: string = "";
  cargando: boolean = false;
  verificandoEmail: boolean = false;

  constructor(
    public toastController: ToastController, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Verificar si ya hay sesión activa
    if (this.authService.isLoggedIn()) {
      console.log('Ya hay sesión activa, redirigiendo...');
      this.router.navigate(['/pageconcomponentes']);
    }
  }

  async registrar() {
    console.log('Iniciando registro...', this.usuario);
    
    if (this.validateModel(this.usuario) && !this.emailInvalido) {
      this.cargando = true;
      this.errorRegistro = false;
      
      try {
        const resultado = await this.authService.registrarUsuario(this.usuario);
        console.log('Resultado del registro:', resultado);
        
        if (resultado.exito) {
          this.presentToast("middle", resultado.mensaje, 3000);
          // Limpiar formulario
          this.usuario = {
            nombreUsuario: "",
            nombre: "",
            email: "",
            contrasena: ""
          };
          // Navegar al login después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/inicial']);
          }, 1000);
        } else {
          this.errorRegistro = true;
          this.mensajeError = resultado.mensaje;
          this.presentToast("middle", resultado.mensaje, 5000);
        }
      } catch (error) {
        console.error('Error completo en registro:', error);
        this.errorRegistro = true;
        this.mensajeError = "Error inesperado al registrar usuario";
        this.presentToast("middle", "Error inesperado al registrar usuario", 5000);
      } finally {
        this.cargando = false;
      }
    } else {
      const mensaje = this.emailInvalido 
        ? "Por favor ingrese un email válido" 
        : "Error: Complete todos los campos correctamente";
      this.presentToast("middle", mensaje, 5000);
    }
  }

  async validarEmail() {
    if (!this.usuario.email) {
      this.emailInvalido = false;
      this.errorRegistro = false;
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.usuario.email);
    
    if (!this.emailInvalido) {
      this.verificandoEmail = true;
      this.errorRegistro = false;
      
      try {
        const emailEnUso = await this.authService.verificarEmailExistente(this.usuario.email);
        if (emailEnUso) {
          this.errorRegistro = true;
          this.mensajeError = "El email ya está registrado";
        }
      } catch (error) {
        console.error('Error verificando email:', error);
      } finally {
        this.verificandoEmail = false;
      }
    } else {
      this.errorRegistro = false;
    }
  }

  validarCampo(campo: string) {
    if (this.usuario[campo] !== "") {
      this.errorRegistro = false;
    }
  }

  formularioValido(): boolean {
    return this.validateModel(this.usuario) && 
           !this.emailInvalido && 
           !this.cargando &&
           !this.errorRegistro;
  }

  validateModel(model: any): boolean {
    for (var [key, value] of Object.entries(model)) {
      if (value === "") {
        this.field = key;
        return false;
      }      
    }
    return true;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 2500,
      position: position,
    });

    await toast.present();
  }
}