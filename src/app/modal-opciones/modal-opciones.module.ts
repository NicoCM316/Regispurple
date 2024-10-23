import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOpcionesPageRoutingModule } from './modal-opciones-routing.module';

import { ModalOpcionesPage } from './modal-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOpcionesPageRoutingModule
  ],
  declarations: [ModalOpcionesPage]
})
export class ModalOpcionesPageModule {}
