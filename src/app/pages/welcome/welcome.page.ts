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
      // Obtener la información del usuario autenticado
      const userInfo = await this.authService.getUserInfo();
      userInfo.subscribe(
        (response) => {
          this.nombreCompleto = response.data.nombre_completo;
          this.perfil = response.data.perfil;
        },
        (error) => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
  
      // Obtener los cursos del usuario autenticado
      const cursosObs = await this.authService.getCursos();
      cursosObs.subscribe(
        (response: any) => {
          console.log('Respuesta de la API para los cursos:', response);
          if (response.cursos && response.cursos.length > 0) {
            this.cursos = response.cursos;
          } else {
            console.log('No hay cursos disponibles para este usuario.');
          }
        },
        (error) => {
          console.error('Error al obtener los cursos:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud de los cursos:', error);
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
