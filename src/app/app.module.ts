import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { QRCodeModule } from 'angularx-qrcode';  // Para la generación de QR codes
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { HttpClientModule } from '@angular/common/http';  // Para las solicitudes HTTP
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxScannerQrcodeModule,  
    QRCodeModule,  // Módulo para QR codes
    IonicStorageModule.forRoot(),  // Configuración de almacenamiento local
    HttpClientModule  // Añadido para manejar solicitudes HTTP
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
