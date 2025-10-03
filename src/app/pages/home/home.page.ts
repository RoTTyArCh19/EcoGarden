import { Component } from '@angular/core';
import { BdlocalService } from 'src/app/services/bdlocal.service';
import { Iagenda } from 'src/app/interfaces/iagenda';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  contactos: any = [];
  nombre!: string;
  numero!: number;
  constructor(private bdlocalservice: BdlocalService) {}

  guardar(){
    console.log(this.nombre);
    console.log(this.numero);
    
    this.bdlocalservice.guardarContactos(this.nombre,this.numero);
    this.contactos =(this.bdlocalservice.mostrarBD());
    console.log(this.contactos);
  }

  eliminar(){
    console.log(this.numero);    
    this.bdlocalservice.quitarContactos(this.numero);
    this.contactos =(this.bdlocalservice.mostrarBD());
  }
  borrarBD(){
    this.bdlocalservice.borrarBD();
    this.contactos =(this.bdlocalservice.mostrarBD());
  }
}
