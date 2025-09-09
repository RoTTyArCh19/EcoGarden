import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-pageconcomponentes',
  templateUrl: './pageconcomponentes.page.html',
  styleUrls: ['./pageconcomponentes.page.scss'],
  standalone: false,
})
export class PageconcomponentesPage implements OnInit {

  constructor(
    private router: Router,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  segmentChanged($event: any) {
    console.log($event);
    let direccion = $event.detail.value;
    console.log(direccion);
    this.router.navigate(['pageconcomponentes/' + direccion]);
  }

  async logout() {
    // Crear animación de salida
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('ion-content') as HTMLElement)
      .duration(500)
      .easing('ease-out')
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'translateY(0)', 'translateY(20px)');

    // Ejecutar animación y luego navegar
    await animation.play();
    this.router.navigate(['/inicial']);
  }
}