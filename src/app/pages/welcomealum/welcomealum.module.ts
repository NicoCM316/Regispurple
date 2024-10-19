import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomealumPageRoutingModule } from './welcomealum-routing.module';

import { WelcomealumPage } from './welcomealum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomealumPageRoutingModule
  ],
  declarations: [WelcomealumPage]
})
export class WelcomealumPageModule {}
