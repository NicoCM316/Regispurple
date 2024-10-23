import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-opciones',
  templateUrl: './modal-opciones.page.html',
  styleUrls: ['./modal-opciones.page.scss'],
})
export class ModalOpcionesPage {
  constructor(private modalController: ModalController) {}

  async seleccionarOpcion(opcion: string) {
    // Cierra el modal y envía la opción seleccionada
    await this.modalController.dismiss(opcion);
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }
}