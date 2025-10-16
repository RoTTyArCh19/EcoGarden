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

  constructor(
    public toastController: ToastController, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  registrar() {
    if (this.validateModel(this.usuario) && !this.emailInvalido) {
      const registroExitoso = this.authService.registrarUsuario(this.usuario);
      
      if (registroExitoso) {
        this.presentToast("middle", "Usuario registrado exitosamente", 3000);
        this.router.navigate(['/inicial']);
      } else {
        this.errorRegistro = true;
        this.mensajeError = "El email ya está registrado";
        this.presentToast("middle", "Error: El email ya está en uso", 5000);
      }
    } else {
      this.presentToast("middle", "Error: Complete todos los campos correctamente", 5000);
    }
  }

  validarEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.usuario.email);
    this.errorRegistro = false;
  }

  validarCampo(campo: string) {
    if (this.usuario[campo] !== "") {
      this.errorRegistro = false;
    }
  }

  formularioValido(): boolean {
    return this.validateModel(this.usuario) && !this.emailInvalido;
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