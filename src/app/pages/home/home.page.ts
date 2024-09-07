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

  // diccionario de usuarios y contraseñas para usar 
  //user nombre de la variable le decimos que sera un nuevo map
  users = new Map<string, string>([
    ['admin', 'admin123'],
    ['user1', 'password1'],
    ['user2', 'password2']
  ]);

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  // Método para mostrar alerta
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: '',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Función para login con mensajes de depuración
  async login() {

    // lo ocupamos para limpiar los inputs 
    const cleanUsername = this.username.trim();
    const cleanPassword = this.password.trim();

    // usamos el map(mapa) para obtener la contraseña del usuario ingresado
    const validadorPass = this.users.get(cleanUsername); 
    // aqui en const validPassword creando y en this.users.get estamos obteniendo la contraseña del usuario ingresado

    // Imprimir los valores para verificar qué se está obteniendo
    //esto lo pueden ver con el f12 en la consola del navegador
    console.log('usuario ingresado:', cleanUsername);
    console.log('contraseña ingresada:', cleanPassword);
    console.log('contraseña esperada:', validadorPass);

    // Verificación del login
    if (validadorPass && validadorPass === cleanPassword) {
      console.log('Valid user');
      this.router.navigate(['/welcome']);  // Navega a la ruta deseada
    } else {
      // Si las credenciales no coinciden, muestra una alerta
      await this.presentAlert('Usuario o contraseña incorrectos.');
      console.log('Invalid user');
    }
  }

  recoveryPassword() { 
    // metodo para recuperar la del username en realidad para ocuparlo en recuperar contraseña
    this.router.navigate(['/recuperar'], 
      { queryParams: { username: this.username } });
  }

}
 
/*

aqui les dejo algunos metodos que se pueden ocupar en el map
que encontre en los fotos 

para crear un nuevo Map
const users = new Map<string, string>();

para añadir pares clave-valor (usuario-contraseña)
users.set('admin', 'admin123');
users.set('user1', 'password1');
users.set('user2', 'password2');

para obtener el valor asociado a una clave
const password = users.get('admin'); // 'admin123'

para poder verificar si una clave existe
const hasUser1 = users.has('user1'); // true

para poder eliminar una clave
users.delete('user2');

para limpiar todos los pares clave-valor
users.clear();

*/