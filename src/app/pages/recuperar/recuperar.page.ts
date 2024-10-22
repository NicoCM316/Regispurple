import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage  {
  correo: string = ''; // Inicializar con una cadena vacía

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private alertController: AlertController,) {}
  
  recuperarPassword() {
      if (this.correo) {
        this.authService.recuperarPassword(this.correo).subscribe(
          async (response) => {
            // Muestra un mensaje de éxito si se envió correctamente
            const alert = await this.alertController.create({
              header: 'Éxito',
              message: 'Se ha enviado un correo con las instrucciones para recuperar la contraseña.',
              buttons: ['OK']
            });
            await alert.present();
            this.router.navigate(['/home']);
          },
          async (error) => {
            // Muestra un mensaje de error si ocurrió un problema
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Hubo un problema al enviar la solicitud. Intenta nuevamente.',
              buttons: ['OK']
            });
            await alert.present();
            this.router.navigate(['/home']);
          }
        );
      }
    }
}