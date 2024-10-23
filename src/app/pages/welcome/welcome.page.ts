import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalOpcionesPage } from '../../modal-opciones/modal-opciones.page'; // Asegúrate de importar el modal correctamente

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {


  cursos: any[] = [];
  userId: string | null = '';  
  nombreCompleto: string = '';
  perfil: string = '';
  correoUsuario: string = '';  // Definir la propiedad para el correo del usuario

  items = [
    { title: 'Card title 1', text: 'Descripción de la tarjeta 1' },
    { title: 'Card title 2', text: 'Descripción de la tarjeta 2' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    try {
      // Obtener la información del usuario
      const userInfo = await this.authService.getUserInfo();
      userInfo.subscribe(
        (response: any) => {
          console.log('Información del usuario:', response);
          this.nombreCompleto = response.data.nombre_completo;  // Mostrar el nombre completo del usuario
          this.perfil = response.data.perfil;  // Mostrar el perfil del usuario
          this.correoUsuario = response.data.correo;  // Obtener el correo del usuario
          
          // Obtener los cursos del estudiante usando su correo
          if (this.correoUsuario) {
            this.obtenerCursosPorCorreo(this.correoUsuario);
          } else {
            console.error('No se pudo obtener el correo del usuario.');
          }
        },
        (error: any) => {
          console.error('Error al obtener la información del usuario:', error);  
        }
      );
    } catch (error) {
      console.error('Error en el proceso de autenticación o carga de cursos:', error);
    }
  }

  // Modificar la función para obtener cursos
  async obtenerCursosPorCorreo(correo: string) {
    try {
      const cursosObs = await this.authService.getCursosPorCorreo(correo);  // Obtener el observable

      // Usar 'await' en lugar de 'subscribe' con un Observable envuelto en una Promesa
      const response = await cursosObs.toPromise();  // Convertir el Observable a una Promesa
      console.log('Cursos obtenidos:', response);  // Verifica si los cursos llegan correctamente
      this.cursos = response.cursos ? response.cursos : [];  // Ajustar según la estructura de la API
    } catch (error) {
      console.error('Error al obtener los cursos por correo:', error);
    }
  }

  verDetallesCurso(curso: any) {
    console.log('Detalles del curso:', curso);
    // Redirige a una página de detalles del curso si tienes una configurada
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
  
  //alert opciones 
  async abrirOpcionesQR() {
    const alert = await this.alertController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Generar QR',
          handler: () => {
            this.generarQR();
          }
        },
        {
          text: 'Crear Curso',
          handler: () => {
            this.crearCurso();  // Llama al método que muestra el `AlertInput`
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  
  generarQR() {
    // Aquí puedes colocar la lógica para generar un QR
    console.log('Generando QR...');
  }

  async crearCurso() {
    const alert = await this.alertController.create({
      header: 'Crear nuevo curso',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del curso'
        },
        {
          name: 'sigla',
          type: 'text',
          placeholder: 'Sigla del curso'
        },
        {
          name: 'institucion',
          type: 'text',
          placeholder: 'Institución'
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción del curso'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: (data) => {
            this.enviarDatosCurso(data);  // Llama a la función para enviar los datos a la API
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  // Definir la función enviarDatosCurso
  // Definir la función enviarDatosCurso
  async enviarDatosCurso(data: any) {
    try {
      const cursosObs = await this.authService.crearCurso(data);
      cursosObs.subscribe(
        (response: any) => {
          console.log('Curso creado exitosamente:', response);
          
          // Agregar el nuevo curso al array de cursos y al scroll
          const nuevoCurso = response.data;
          this.cursos.push(nuevoCurso); // Agregar al array de cursos
          
          // Agregar al array de items para que aparezca en el scroll
          this.items.push({
            title: nuevoCurso.nombre, // Título del curso
            text: nuevoCurso.descripcion // Descripción del curso
          });
        },
        (error: any) => {
          console.error('Error al crear el curso:', error);
        }
      );
    } catch (error) {
      console.error('Error en la creación del curso:', error);
    }
  }
  

}
