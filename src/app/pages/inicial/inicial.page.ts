import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
  standalone: false,
})
export class InicialPage implements OnInit {

  usuario: any = {
    contrasena: "",
    email: ""
  }

  field: string = "";
  errorLogin: boolean = false;

  constructor(
    public toastController: ToastController, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  navegar() {
    if (this.validateModel(this.usuario)) {
      const loginExitoso = this.authService.login(this.usuario.email, this.usuario.contrasena);
      
      if (loginExitoso) {
        this.errorLogin = false;
        let navigationExtras: NavigationExtras = {
          state: { usuario: this.authService.getUsuarioActual() }
        };
        this.router.navigate(['/pageconcomponentes'], navigationExtras);
      } else {
        this.errorLogin = true;
        this.presentToast("middle", "Error: Email o contraseña incorrectos", 5000);
      }
    } else {
      this.presentToast("middle", "Error: Falta " + this.field, 5000);
    }
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