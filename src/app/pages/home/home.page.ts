import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  correo: string = '';
  password: string = '';
  perfil: string = '';  

  constructor(
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.correo, this.password).subscribe(
      async (response) => {
        console.log('Respuesta de inicio de sesión:', response); // Depura la respuesta completa
  
        // Verifica que exista el token y los datos necesarios en la respuesta
        if (response.auth && response.auth.token) {
          // Guardar el token de autenticación
          await this.authService.saveToken(response.auth.token);
  
          // **Aquí se muestra el token en la consola**
          console.log('Token de autenticación recibido:', response.auth.token);
  
          // Verifica que el perfil exista en la respuesta
          if (response.data && response.data.perfil) {
            const perfil = response.data.perfil;
  
            // Redirigir según el perfil del usuario
            if (perfil === 'docente') {
              this.router.navigate(['/welcomealum']);  // Página para docentes
            } else if (perfil === 'estudiante') {
              this.router.navigate(['/welcome']);  // Página para estudiantes
            } else {
              console.error('Perfil desconocido o faltante:', perfil);
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'Perfil desconocido. No se puede redirigir.',
                buttons: ['OK'],
              });
              await alert.present();
            }
  
            // Guardar también el perfil y el nombre completo
            await this.authService.saveUserProfile(perfil, response.data.nombre_completo);
          } else {
            console.error('No se encontró el perfil en la respuesta del servidor');
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'No se pudo obtener el perfil del usuario.',
              buttons: ['OK'],
            });
            await alert.present();
          }
        } else {
          // Si el token no está presente, mostrar un mensaje de error
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Correo o contraseña incorrectos',
            buttons: ['OK'],
          });
          await alert.present();
        }
      },
      async (error) => {
        // Manejar errores en caso de que la solicitud falle
        console.error('Error en el inicio de sesión:', error);
  
        let errorMessage = 'Error en el servidor. Por favor, intenta de nuevo más tarde.';
        if (error.status === 401) {
          errorMessage = 'Correo o contraseña incorrectos. Inténtalo nuevamente.';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        }
  
        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  

  recoveryPassword() { 
    // metodo para recuperar la del username en realidad para ocuparlo en recuperar contraseña
    this.router.navigate(['/recuperar'], 
      { queryParams: { username: this.correo } });
  }


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

  
}