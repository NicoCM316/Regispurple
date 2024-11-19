import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clase',
  templateUrl: './clase.page.html',
  styleUrls: ['./clase.page.scss'],
})
export class ClasePage implements OnInit {
  cursoId: number | null = null; // Inicializado con null para evitar el error
  codigoClase: string = ''; // Código web recibido desde detalle
  asistencia: any[] = [];
  claseInfo: any;
  totalAsistencias: number = 0;
  mensaje: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    const cursoIdParam = this.route.snapshot.paramMap.get('id');
    const codigoClaseParam = this.route.snapshot.paramMap.get('code'); // Obteniendo el código web

    console.log('Parámetro cursoId:', cursoIdParam);
    console.log('Parámetro códigoClase:', codigoClaseParam);

    if (cursoIdParam) {
      this.cursoId = Number(cursoIdParam);
      console.log('cursoId asignado:', this.cursoId);
    }
    if (codigoClaseParam) {
      this.codigoClase = codigoClaseParam;
      console.log('Código de clase asignado:', this.codigoClase);
    }

    if (this.cursoId !== null && this.codigoClase) {
      console.log('Iniciando carga del historial de asistencia...');
      this.cargarHistorialAsistencia(this.cursoId, this.codigoClase);
    } else {
      console.warn('cursoId o código de clase no está definido correctamente');
    }
  }

  async cargarHistorialAsistencia(cursoId: number, codigoClase: string) {
    console.log('Llamando al servicio para cargar historial de asistencia con cursoId:', cursoId, 'y códigoClase:', codigoClase);
    try {
      // Convertir codigoClase a número si es necesario
      const codigoClaseNumber = Number(codigoClase);

      if (!isNaN(codigoClaseNumber)) {
        const asistenciaObs = await this.authService.obtenerHistorialAsistencia(cursoId, codigoClaseNumber);
        asistenciaObs.subscribe(
          (response: any) => {
            console.log('Respuesta de asistencia:', response);
            this.mensaje = response.message;
            console.log('Mensaje recibido:', this.mensaje);

            this.claseInfo = response.clase;
            console.log('Información de la clase:', this.claseInfo);

            this.totalAsistencias = response.total;
            console.log('Total de asistencias:', this.totalAsistencias);

            this.asistencia = response.asistencias;
            console.log('Detalle de asistencias:', this.asistencia);
          },
          (error) => {
            console.error('Error al cargar el historial de asistencia:', error);
          }
        );
      } else {
        console.error('El código de clase no es un número válido:', codigoClase);
      }
    } catch (error) {
      console.error('Error al solicitar el historial de asistencia:', error);
    }
  }
}
