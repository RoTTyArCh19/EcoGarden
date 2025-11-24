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
  cargando: boolean = false;
  mensajeError: string = "";

  constructor(
    public toastController: ToastController, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Verificar si ya hay una sesión activa al cargar la página
    this.verificarSesionActiva();
  }

  private verificarSesionActiva() {
    if (this.authService.isLoggedIn()) {
      console.log('Sesión activa encontrada, redirigiendo...');
      this.cargando = true;
      
      // Pequeño delay para mejor UX
      setTimeout(() => {
        const usuario = this.authService.getUsuarioActual();
        let navigationExtras: NavigationExtras = {
          state: { usuario: usuario }
        };
        this.router.navigate(['/pageconcomponentes'], navigationExtras);
        this.cargando = false;
      }, 1000);
    } else {
      // Limpiar datos de sesión si no está autenticado
      console.log('No hay sesión activa, mostrando formulario de login');
    }
  }

  async navegar() {
    console.log('Iniciando proceso de login...');
    
    if (this.validateModel(this.usuario)) {
      this.cargando = true;
      this.errorLogin = false;
      
      try {
        const resultado = await this.authService.login(this.usuario.email, this.usuario.contrasena);
        console.log('Resultado del login:', resultado);
        
        if (resultado.exito) {
          this.presentToast("middle", "¡Login exitoso!", 2000);
          let navigationExtras: NavigationExtras = {
            state: { usuario: this.authService.getUsuarioActual() }
          };
          // Pequeño delay para que se vea el toast
          setTimeout(() => {
            this.router.navigate(['/pageconcomponentes'], navigationExtras);
          }, 500);
        } else {
          this.errorLogin = true;
          this.mensajeError = resultado.mensaje;
          this.presentToast("middle", resultado.mensaje, 4000);
        }
      } catch (error) {
        console.error('Error completo en login:', error);
        this.errorLogin = true;
        this.mensajeError = "Error al iniciar sesión";
        this.presentToast("middle", "Error al iniciar sesión", 4000);
      } finally {
        this.cargando = false;
      }
    } else {
      this.presentToast("middle", "Error: Falta " + this.field, 4000);
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

  // Método para probar login rápido
  async loginRapido(email: string, contrasena: string) {
    this.usuario.email = email;
    this.usuario.contrasena = contrasena;
    await this.navegar();
  }
}