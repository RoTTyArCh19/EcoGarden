import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
  standalone: false,
})
export class InicialPage implements OnInit {

  //declarar un modelo para validar
  usuario: any={
    contrasena:"",
    email:""
  }
  //defino una variable global para guardar el nombre del campo vacío
  field: string="";
  constructor(public toastController: ToastController, private router: Router) { }

  ngOnInit() {
  }

  navegar(){
    if (this.validateModel(this.usuario)) {
      //si tengo los datos navego hacia la siguiente page
      //agrego la creación de un parámetro para enviar los datos a la otra page
      let navigationExtras : NavigationExtras = {
        state: {usuario: this.usuario}
      };
      //invoco el llamado a la siguiente page
      this.router.navigate(['/pageconcomponentes'], navigationExtras);

    }else{
      this.presentToast("middle","Error: Falta "+this.field,5000)
    }
  }
  /**
     * validateModel sirve para validar que se ingrese algo en los
     * campos del html mediante su modelo
  */
  validateModel(model: any){
    //Recorro modelo 'usuario' revisando las entradas del Object
    for (var [key,value] of Object.entries(model)) {
      //si el value es "" retorno false e indico el nombre del campo que falta
      if (value == "") {
        this.field = key;
        return false;
      }      
    }
    return true;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg:string, duration?:number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration?duration:2500,
      position: position,
    });

    await toast.present();
  }
}
