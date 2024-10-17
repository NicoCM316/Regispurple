import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  username: string = ''; // Variable para el username

  constructor(private route: ActivatedRoute, 
    private router: Router, private menu: MenuController) { }

  ngOnInit() {
    // Suscribirse a los parámetros de la URL para obtener el username
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || ''; // Captura el username de la URL
    });
  }

   cerrarSesion() { 
    if (confirm('¿Desea cerrar sesión?')) {
      this.router.navigate(['/home']);
    }
  }

btnClickPrueba() {
  console.log('click en boton');
  this.router.navigate(['/recuperar']);
}


openMenu() {
  this.menu.open();
}

}