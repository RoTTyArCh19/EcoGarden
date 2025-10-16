import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pageconcomponentes',
  templateUrl: './pageconcomponentes.page.html',
  styleUrls: ['./pageconcomponentes.page.scss'],
  standalone: false,
})
export class PageconcomponentesPage implements OnInit {

  usuarioActual: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.router.navigate(['pageconcomponentes/uno']);
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
            // Logout directo sin animaciones que afecten el DOM
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}