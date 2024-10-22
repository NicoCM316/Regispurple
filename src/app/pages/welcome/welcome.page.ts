import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  cursos: any[] = [];
  userId: string | null = '';  // Declarar la propiedad userId aquí
  nombreCompleto: string = '';
  perfil: string = '';

  items = [
    { title: 'Card title 1', text: 'Descripción de la tarjeta 1' },
    { title: 'Card title 2', text: 'Descripción de la tarjeta 2' },
  ];

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private menu: MenuController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      // Obtener la información del usuario
      const userInfo = await this.authService.getUserInfo();
      userInfo.subscribe(
        (response: any) => {
          console.log('Información del usuario:', response);
          this.nombreCompleto = response.data.nombre_completo;  // Mostrar el nombre completo del usuario
          this.perfil = response.data.perfil;  // Mostrar el perfil del usuario
          const correo = response.data.correo;  // Obtener el correo del usuario
  
          // Obtener los cursos del estudiante usando su correo
          if (correo) {
            this.obtenerCursosPorCorreo(correo);
          } else {
            console.error('No se pudo obtener el correo del usuario.');
          }
        },
        (error: any) => {
          console.error('Error al obtener la información del usuario:', error);  // Ver el error completo
        }
      );
    } catch (error) {
      console.error('Error en el proceso de autenticación o carga de cursos:', error);
    }
  }
  
  async obtenerCursosPorCorreo(correo: string) {
    try {
      const cursosObs = await this.authService.getCursosPorCorreo(correo);
      cursosObs.subscribe(
        (response: any) => {
          console.log('Cursos obtenidos:', response);  // Verifica si los cursos llegan correctamente
          this.cursos = response.cursos ? response.cursos : [];  // Ajustar según la estructura de la API
        },
        (error: any) => {
          console.error('Error al obtener los cursos por correo:', error);  // Ver el error completo
        }
      );
    } catch (error) {
      console.error('Error al buscar los cursos por correo:', error);
    }
  }

  verDetallesCurso(curso: any) {
    this.router.navigate(['/curso-detalle', curso.id]);
  }

  cerrarSesion() {
    if (confirm('¿Desea cerrar sesión?')) {
      this.router.navigate(['/home']);
    }
  }

  btnClickPrueba() {
    this.router.navigate(['/recuperar']);
  }

  openMenu() {
    this.menu.open();
  }

  loadMoreContent(event: any) {
    const scrollPosition = event.target.scrollLeft + event.target.offsetWidth;
    const maxScroll = event.target.scrollWidth;

    if (scrollPosition >= maxScroll - 1) {
      this.items = [
        ...this.items,
        { title: 'New Card', text: 'Descripción de la nueva tarjeta' }
      ];
    }
  }
}
