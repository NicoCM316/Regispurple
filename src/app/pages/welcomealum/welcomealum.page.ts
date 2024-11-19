import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcomealum',
  templateUrl: './welcomealum.page.html',
  styleUrls: ['./welcomealum.page.scss'],
})
export class WelcomealumPage implements OnInit {
  cursos: any[] = [];
  userId: string | null = '';
  nombreCompleto: string = '';
  perfil: string = '';
  nombre: string = '';
  correoUsuario: string = '';
  imgPerfil: string = '';
  cursoID: string = '';
  scannedData: any;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      // Obtener y mostrar el token de autenticación en la consola
      const token = await this.authService.getToken();
      console.log('Token de autenticación:', token);

      // Obtener la información del usuario
      const userInfo = await this.authService.getUserInfo();
      userInfo.subscribe(
        async (response: any) => {
          console.log('Información del usuario:', response);
          this.nombreCompleto = response.data.nombre_completo;
          this.perfil = response.data.perfil;
          this.correoUsuario = response.data.correo;
          this.imgPerfil = response.data.img;
          this.nombre = response.data.nombre;
          if (this.correoUsuario) {
            console.log('Correo del usuario:', this.correoUsuario);
            console.log('Perfil del usuario:', this.perfil);
            console.log('id del usuario:', response.data.id);

            // Llamar a la función para obtener y mostrar los cursos inscritos
            await this.getCursosInscritos();
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

  irACambiarContrasena() {
    this.router.navigate(['/profile']);
  }

  async getCursosInscritos() {
    try {
      const response = await this.authService.getCursosInscritosEstudiante();
      console.log('Cursos inscritos obtenidos:', response);

      // Verifica si response es un objeto que contiene cursos
      if (response && response['cursos']) {
        this.cursos = response['cursos']; // Accede a la propiedad cursos del objeto
      } else {
        console.error('La respuesta no contiene la propiedad cursos');
        this.cursos = [];
      }
    } catch (error) {
      console.error('Error al obtener los cursos inscritos:', error);
      this.cursos = []; // Asegúrate de manejar el estado de error limpiamente
    }
  }

  cerrarSesion() {
    if (confirm('¿Desea cerrar sesión?')) {
      this.router.navigate(['/login']);
    }
  }

  verMisCursos() {
    console.log('Ver mis cursos');
    // Aquí puedes agregar la lógica para navegar a la página de "mis cursos"
    this.router.navigate(['/mis-cursos']);
  }

  async verDetallesCurso(curso: any) {
    console.log('ID del curso seleccionado:', curso.id); // Verificar que el ID esté presente
    this.router.navigate(['/detalle-est', curso.id], { state: { curso: curso } });
  }

  scanQRCode() {
    BarcodeScanner.checkPermission({ force: true }).then((status) => {
      if (status.granted) {
        BarcodeScanner.hideBackground();
        BarcodeScanner.startScan().then(async (result) => {
          BarcodeScanner.showBackground();
          if (result.hasContent) {
            console.log('QR Code data:', result.content);
            this.scannedData = result.content;

            if (this.isValidURL(result.content)) {
              let url = result.content.trim();
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
              }
              await Browser.open({ url });
            } else {
              console.log('Contenido escaneado no es una URL. Intentando registrar en clase...');
              await this.matricularEnCurso(result.content);
            }
          } else {
            this.showScanResult('No se encontró contenido en el código QR.');
          }
        }).catch((err) => {
          console.error('Error al escanear QR:', err);
          BarcodeScanner.showBackground();
        });
      } else {
        console.log('Permiso denegado para usar la cámara.');
      }
    });
  }

  async showScanResult(data: string) {
    const alert = await this.alertController.create({
      header: 'QR Code Scanned',
      message: `Data: ${data}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async matricularEnCurso(courseCode: string) {
    try {
      (await this.authService.registrarAsistencia(courseCode)).subscribe(
        (response) => {
          console.log('Enrolled successfully:', response);
          this.showScanResult('Enrolled successfully in course: ' + courseCode);
        },
        (error) => {
          console.error('Error enrolling in course:', error);
          this.showScanResult('Failed to enroll in course: ' + courseCode);
        }
      );
    } catch (error) {
      console.error('Error en el proceso de matrícula:', error);
    }
  }

  isValidURL(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  async mostrarInputCodigoCurso() {
    const alert = await this.alertController.create({
      header: 'Inscribirse en Curso',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Ingrese el código del curso',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Inscripción cancelada');
          },
        },
        {
          text: 'Inscribirse',
          handler: (data) => {
            if (data.codigo) {
              this.matricularEnCurso(data.codigo);
            } else {
              console.error('El código está vacío.');
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
