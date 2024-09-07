import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = '';
  password: string = '';

  users: { [key: string]: string } = {
    'admin': 'admin123',
    'user1': 'password1',
    'user2': 'password2'
  };
  constructor(
    private alertController: AlertController, 
    private router: Router,
    private activeRoute: ActivatedRoute
    
    ) { } // Inject AlertController and Router

  async login() {
    // Verifica si el nombre de usuario existe en el diccionario y si la contraseña es correcta
    if (this.users[this.username] && this.users[this.username] === this.password) {
      this.router.navigate(['./welcome']);  // Navegar a la página de bienvenida
    } else {
      // Mostrar alerta si las credenciales no son válidas
      const alert = await this.alertController.create({
        header: 'Usuario Invalido',
        subHeader: '',
        message: 'El nombre de usuario o la contraseña no son correctos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  recoveryPassword() { 
    // metodo para recuperar la del username en realidad para ocuparlo en recuperar contraseña
    this.router.navigate(['/recuperar'], 
      { queryParams: { username: this.username } });
  }


}
