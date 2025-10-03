import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Iagenda } from '../interfaces/iagenda';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BdlocalService {

  agenda: Iagenda[] = [];
  private _storage: Storage | null=null;
  
  constructor(private storage: Storage, public toastController: ToastController) {
    this.Init();
    this.cargarContactos();
   }

  async Init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  guardarContactos(nombre:string,nro:number){
    const existe = this.agenda.find(c => c.intNumero === nro);    
    if(!existe){
      this.agenda.unshift({strNombre:nombre, intNumero:nro})//permite insertar un nuevo elemento al inicio de la colección
      this._storage?.set('agenda',this.agenda);
      this.presentToast("Contacto Agregado")
    }else{
      this.presentToast("Contacto Ya Existe")
    }   
  }
  
  async cargarContactos() {
    const miAgenda= await this.storage.get('agenda');
    if(miAgenda)
    {
      this.agenda=miAgenda; 
    }    
  }

  async quitarContactos(nro: number){
    const existe=this.agenda.find(c => c.intNumero === nro);
    if (existe) {
      this.agenda=this.agenda.filter(c=>c.intNumero !== nro);
      this._storage?.set('agenda', this.agenda);
      this.presentToast("Se ha eliminado de la agenda");    
    }else{
      this.presentToast("Ese N° no Existe en la agenda");
    }    
  }
  
  async borrarBD() {
    await this._storage?.clear();
    this.agenda=[];
    console.log(this.agenda.length);
    this.presentToast("Se ha eliminado de la BD"); 
  }

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      translucent:true,
      color:'medium',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  
  async mostrarBD(){
    return this.agenda;
  }
}
