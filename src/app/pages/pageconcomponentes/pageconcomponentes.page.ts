import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-pageconcomponentes',
  templateUrl: './pageconcomponentes.page.html',
  styleUrls: ['./pageconcomponentes.page.scss'],
  standalone: false,
})
export class PageconcomponentesPage implements OnInit {

  usuarioActual: any;
  nombreMostrar: string = '';
  fotoPerfil: string = 'assets/icon/user-default.png';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private cameraService: CameraService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarUsuarioDesdeEstado();
    this.router.navigate(['pageconcomponentes/uno']);
  }

  cargarUsuarioDesdeEstado() {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras?.state?.['usuario']) {
      this.usuarioActual = navigation.extras.state['usuario'];
    } else {
      this.usuarioActual = this.authService.getUsuarioActual();
    }

    this.actualizarDatosUsuario();
    
    if (!this.usuarioActual) {
      this.router.navigate(['/inicial']);
    }
  }

  actualizarDatosUsuario() {
    if (this.usuarioActual) {
      this.nombreMostrar = this.usuarioActual.nombre_usuario || 
                          this.usuarioActual.nombre || 
                          this.usuarioActual.email ||
                          'Usuario';
      
      this.fotoPerfil = this.usuarioActual.foto_perfil || 'assets/icon/user-default.png';
    }
  }

  ionViewWillEnter() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.actualizarDatosUsuario();
  }

  // Cambiar foto de perfil
async cambiarFotoPerfil() {
  try {
    const imageData = await this.cameraService.showImageOptions();
    
    if (imageData) {
      const loading = await this.loadingController.create({
        message: 'Guardando foto...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        // USAR MÉTODO TEMPORAL que guarda en base de datos
        const imageUrl = await this.cameraService.saveImageToDatabase(
          imageData, 
          this.usuarioActual.id
        );

        // Actualizar localmente
        this.usuarioActual.foto_perfil = imageUrl;
        this.fotoPerfil = imageUrl;
        
        // Actualizar en localStorage
        localStorage.setItem('usuario_actual', JSON.stringify(this.usuarioActual));

        await loading.dismiss();
        this.presentAlert('Éxito', '✅ Foto de perfil actualizada correctamente');

      } catch (error: any) {
        await loading.dismiss();
        console.error('Error guardando imagen:', error);
        this.presentAlert('Error', '❌ Error al guardar la foto: ' + (error.message || 'Error desconocido'));
      }
    }
  } catch (error: any) {
    console.error('Error cambiando foto:', error);
    if (error.message !== 'Usuario canceló la selección') {
      this.presentAlert('Error', '❌ No se pudo cambiar la foto: ' + (error.message || 'Error desconocido'));
    }
   }
}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  segmentChanged($event: any) {
    let direccion = $event.detail.value;
    this.router.navigate(['pageconcomponentes/' + direccion]);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Sí, Salir',
          cssClass: 'danger',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}