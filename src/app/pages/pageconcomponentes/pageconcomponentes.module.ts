import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageconcomponentesPageRoutingModule } from './pageconcomponentes-routing.module';

import { PageconcomponentesPage } from './pageconcomponentes.page';
import { Componente1Component } from 'src/app/components/componente1/componente1.component';
import { Componente2Component } from 'src/app/components/componente2/componente2.component';
import { Componente3Component } from 'src/app/components/componente3/componente3.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageconcomponentesPageRoutingModule
  ],
  declarations: [PageconcomponentesPage, 
    Componente1Component,
    Componente2Component,
    Componente3Component]
  /*Componente1Component lo agregué en declarations para que así la PAGE sepa que debe 
  compartir sus recursos con este component, si no lo hago no podría escribir etiquetas 'ion-algo' en
  el html.
  Se debe hacer con cada COMPONENT que dibuje en la PAGE dónde lo dibuje*/

})
export class PageconcomponentesPageModule {}
