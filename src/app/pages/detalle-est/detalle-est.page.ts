import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-est',
  templateUrl: './detalle-est.page.html',
  styleUrls: ['./detalle-est.page.scss'],
})
export class DetalleEstPage implements OnInit {
  curso: any;
  clases: any[] = [];
  anuncios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    // Recibe el estado pasado desde la página anterior
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.curso = navigation.extras.state['curso'];
      console.log('Datos del curso recibido en DetalleEstPage:', this.curso);
    }
  }

  ngOnInit() {
    const cursoId = this.curso?.id || this.route.snapshot.paramMap.get('id');
    console.log('ID del curso en DetalleEstPage:', cursoId);

    if (cursoId) {
      this.cargarDetalleCurso(cursoId);
      this.cargarAnunciosDelCurso(cursoId);
    }
  }

  async cargarDetalleCurso(id: string) {
    try {
      const response = await this.authService.getCursoPorID(id);
      if (response && response.curso) {
        this.curso = response.curso;
      } else {
        console.error('La respuesta no contiene la información del curso esperada:', response);
      }
    } catch (error) {
      console.error('Error al solicitar los detalles del curso:', error);
    }
  }

  async cargarAnunciosDelCurso(cursoId: string) {
    try {
      const anuncios = await this.authService.getAnunciosPorCursoId(cursoId);
      if (anuncios && anuncios.length > 0) {
        this.anuncios = anuncios;
        console.log('Anuncios cargados:', this.anuncios);
      } else {
        console.log('No hay anuncios para este curso.');
        this.anuncios = []; // Asegúrate de limpiar la lista si no hay anuncios
      }
    } catch (error) {
      console.error('Error al cargar los anuncios del curso:', error);
    }
  }
  

  obtenerDiaSemana(fecha: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fechaObj = new Date(fecha);
    return diasSemana[fechaObj.getUTCDay()];
  }

  verDetallesClase(cursoId: number, codigo_web: string) {
    console.log('Navegando a la clase con código web:', codigo_web);
    this.router.navigate([`/detalle/${cursoId}/clase/${codigo_web}`]);
  }

  async verDetallesAnuncio(anuncio: any) {
    const alert = await this.alertController.create({
      header: anuncio.titulo,
      message: anuncio.mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  

  generarListaAnuncios(anuncios: any[]): string {
    let listaHtml = '<ul>';
    anuncios.forEach((anuncio) => {
      listaHtml += `<li><strong>${anuncio.titulo}:</strong> ${anuncio.mensaje}</li>`;
    });
    listaHtml += '</ul>';
    return listaHtml;
  }

  async abrirAlertaReportarInasistencia(cursoId: string) {
    const alert = await this.alertController.create({
      header: 'Reportar Inasistencia',
      inputs: [
        {
          name: 'fecha',
          type: 'date',
          placeholder: 'Fecha de inasistencia'
        },
        {
          name: 'mensaje',
          type: 'textarea',
          placeholder: 'Motivo de la inasistencia'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Reporte de inasistencia cancelado');
          }
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (data.fecha && data.mensaje) {
              try {
                const response = await this.authService.reportarInasistencia(cursoId, data);
                response.subscribe(
                  (res) => {
                    console.log('Inasistencia reportada exitosamente:', res);
                    this.alertController.create({
                      header: 'Éxito',
                      message: 'Inasistencia reportada correctamente',
                      buttons: ['OK']
                    }).then(alertEl => alertEl.present());
                  },
                  (err) => {
                    console.error('Error al reportar inasistencia:', err);
                    this.alertController.create({
                      header: 'Error',
                      message: 'No se pudo reportar la inasistencia. Intente nuevamente.',
                      buttons: ['OK']
                    }).then(alertEl => alertEl.present());
                  }
                );
              } catch (error) {
                console.error('Error en el proceso de reporte de inasistencia:', error);
              }
            } else {
              console.error('La fecha y el mensaje son obligatorios');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async cargarInasistenciasDelCurso(cursoId: string) {
    try {
      const inasistencias = await this.authService.getInasistenciasPorCursoId(cursoId);
      if (inasistencias && inasistencias.length > 0) {
        this.mostrarListaInasistencias(inasistencias);
      } else {
        console.log('No se encontraron inasistencias para este curso.');
        this.alertController.create({
          header: 'Inasistencias',
          message: 'No se encontraron inasistencias para este curso.',
          buttons: ['OK']
        }).then(alertEl => alertEl.present());
      }
    } catch (error) {
      console.error('Error al cargar las inasistencias del curso:', error);
    }
  }
  
  async mostrarListaInasistencias(inasistencias: any[]) {
    const alert = await this.alertController.create({
      header: 'Lista de Inasistencias',
      message: this.generarListaInasistencias(inasistencias),
      buttons: ['Cerrar']
    });
  
    await alert.present();
  }
  
  generarListaInasistencias(inasistencias: any[]): string {
    let listaHtml = '<ul>';
    inasistencias.forEach((inasistencia) => {
      listaHtml += `<li><strong>Fecha:</strong> ${inasistencia.fecha} - <strong>Motivo:</strong> ${inasistencia.mensaje}</li>`;
    });
    listaHtml += '</ul>';
    return listaHtml;
  }

}
