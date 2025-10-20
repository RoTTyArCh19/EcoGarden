import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';


//import de http acutalizado a esta version 
import { HttpClientModule } from '@angular/common/http';
import { PlantasService } from './services/plantas.service';
import { ImagenService } from './services/imagen.service';
import { SupabaseService } from './services/supabase.service';
import { PlantasSupabaseService } from './services/plantas-supabase.service';
import { NotasSupabaseService } from './services/notas-supabase.service';
import { CameraService } from './services/camera.service';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot(), HttpClientModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy,},AuthGuard,AuthService,SupabaseService,PlantasSupabaseService,NotasSupabaseService,PlantasService,ImagenService,CameraService],
  bootstrap: [AppComponent],
})
export class AppModule {}
