import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = '';
  password: string = '';

  constructor(private alertController: AlertController, private router: Router) { } // Inject AlertController and Router

  async onClickMe() {
    console.log('Button clicked!');
    await this.presentAlert(); // Show alert when the first button is clicked
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'BTN Clicked',
      message: 'Hiciste click!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async login() {
    if (this.username.trim().length < 5 || this.password.trim().length < 8) {// la ocupe para darle la restrincion de validacion 

      const alert = await this.alertController.create({ // creamos la alerta y lo que traera despues
        header: 'Error', // titulo de la alerta
        subHeader: 'valor ingresado incorrecto', // subtitulo de la alerta
        message: 'Username must be at least 5 characters and password at least 8 characters.', // mensaje de la alerta
        buttons: ['OK'], // boton de la alerta
      });
      await alert.present(); // mostramos la alerta
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  recoverPassword() { // metodo para recuperar la del username en realidad para ocuparlo en recuperar contraseña
    this.router.navigate(['/recuperar'], { queryParams: { username: this.username } });
  }


}
