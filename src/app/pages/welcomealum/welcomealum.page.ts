import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

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
  correoUsuario: string = '';  
  imgPerfil: string = '';  
  codigoMatriculaQR: string = '';
  scannedData: any;

  items = [
    { title: 'Card title 1', text: 'Descripción de la tarjeta 1' },
    { title: 'Card title 2', text: 'Descripción de la tarjeta 2' },
  ];
  
  config = {
    fps: 10,
    vibrate: 400,
    isBeep: true,
    decode: 'once'
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private platform: Platform,
    private barcodeScanner: BarcodeScanner,
  ) { }

  async ngOnInit() {
    try {
      const userInfo = await this.authService.getUserInfo();
      userInfo.subscribe(
        (response: any) => {
          this.nombreCompleto = response.data.nombre_completo;
          this.perfil = response.data.perfil;
          this.correoUsuario = response.data.correo;
          this.imgPerfil = response.data.img;

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

  async obtenerCursosPorCorreo(correo: string) {
    try {
      const cursosObs = await this.authService.getCursosPorCorreo(correo);
      const response = await cursosObs.toPromise();
      this.cursos = response.cursos ? response.cursos.map((curso: any) => ({
        ...curso,
        codigo_matricula: curso.codigo_matricula  
      })) : [];
    } catch (error) {
      console.error('Error al obtener los cursos por correo:', error);
    }
  }

  async verDetallesCurso(curso: any) {
    const alert = await this.alertController.create({
      header: 'Detalles del Curso',
      message: `
        Nombre: ${curso.nombre}
        Descripción: ${curso.descripcion}
        Código Matrícula: ${curso.codigo_matricula}
      `,
      buttons: [{ text: 'Cerrar', role: 'cancel' }]
    });
    await alert.present();
  }

  cerrarSesion() {
    if (confirm('¿Desea cerrar sesión?')) {
      this.router.navigate(['/home']);
    }
  }

  openMenu() {
    this.menu.open();
  }

  scanQRCode() {
    if (this.platform.is('cordova')) {
      this.barcodeScanner.scan().then(barcodeData => {
        console.log('QR Code data:', barcodeData);
        this.scannedData = barcodeData.text;
        this.matricularEnCurso(barcodeData.text);  // Aquí se llama a la función para matricularse usando el QR escaneado
      }).catch(err => {
        console.log('Error', err);
      });
    } else {
      this.showScanResult('Cordova is not available - Please test on a real device.');
      console.log('Cordova not available');
    }
  }

  async showScanResult(data: string) {
    const alert = await this.alertController.create({
      header: 'QR Code Scanned',
      message: `Data: ${data}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async abrirOpcionesQR() {
    const alert = await this.alertController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  onCodeResult(event: any) {
    const result = event;  // Si el código QR viene en el evento
    console.log('Código QR escaneado:', result);
    this.matricularEnCurso(result);  // Llamar a la función para matricularse con el código escaneado
  }

  async enrollInCourse() {
  const alert = await this.alertController.create({
    header: 'Join a Course',
    inputs: [
      {
        name: 'courseCode',
        type: 'text',
        placeholder: 'Enter Course Code'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Enrollment cancelled');
        }
      },
      {
        text: 'Join',
        handler: (data: any) => {  // Especificar el tipo del parámetro data
          this.matricularEnCurso(data.courseCode);
        }
      }
    ]
  });

  await alert.present();
}

  
  // Método para matricularse en el curso utilizando el código QR
  async matricularEnCurso(courseCode: string) {
    try {
      // Reemplazamos {code} en la URL con el valor de courseCode ingresado por el usuario
      const url = `/api/v1/clases/${courseCode}/asistencia`;
  
      (await this.authService.unirseACursoPorCodigo(courseCode)).subscribe(
        (response) => {
          console.log('Enrolled successfully:', response);
          // Mostrar un mensaje de éxito si es necesario
          this.showScanResult('Enrolled successfully in course: ' + courseCode);
        },
        (error) => {
          console.error('Error enrolling in course:', error);
          // Mostrar un mensaje de error si es necesario
          this.showScanResult('Failed to enroll in course: ' + courseCode);
        }
      );
    } catch (error) {
      console.error('Error en el proceso de matrícula:', error);
    }
  }
}
