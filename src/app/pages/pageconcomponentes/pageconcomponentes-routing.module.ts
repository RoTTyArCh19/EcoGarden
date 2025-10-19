import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageconcomponentesPage } from './pageconcomponentes.page';
import { Componente1Component } from 'src/app/components/componente1/componente1.component';
import { Componente2Component } from 'src/app/components/componente2/componente2.component';
import { Componente3Component } from 'src/app/components/componente3/componente3.component';
import { WikiPlantasComponent } from 'src/app/components/wiki-plantas/wiki-plantas.component';

const routes: Routes = [
  {
    path: '',
    component: PageconcomponentesPage,
    /*declaro las rutas hijas que se cargarán en la Page pageconcomponentes
    el valor de los path es el mismo que obtuve desde el value del ion-segment*/
    children:[
      {
        path: 'uno',
        component: Componente1Component
      },
      {
        path: 'dos',
        component: Componente2Component
      },
      {
        path: 'tres',
        component: Componente3Component
      },
      {
        path: 'wiki',
        component: WikiPlantasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageconcomponentesPageRoutingModule {}
