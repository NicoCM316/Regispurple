import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-welcomealum',
  templateUrl: './welcomealum.page.html',
  styleUrls: ['./welcomealum.page.scss'],
})
export class WelcomealumPage implements OnInit {
  username: string = ''; // Variable para el username

  // Lista inicial de elementos para las tarjetas
  items = [
    { title: 'Card title 1', text: 'Descripción de la tarjeta 1' },
    { title: 'Card title 2', text: 'Descripción de la tarjeta 2' },
    // Puedes añadir más ítems iniciales aquí
  ];

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private menu: MenuController
  ) { }

  ngOnInit() {
    // Suscribirse a los parámetros de la URL para obtener el username
    this.route.queryParams.subscribe(params => {
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

  // Función para cargar más contenido cuando llegue al final del scroll
  loadMoreContent(event: any) {
    const scrollPosition = event.target.scrollLeft + event.target.offsetWidth;
    const maxScroll = event.target.scrollWidth;

    if (scrollPosition >= maxScroll - 1) {
      // Añade más elementos a la lista
      this.items = [
        ...this.items,
        { title: 'New Card', text: 'Descripción de la nueva tarjeta' }
      ];
    }
  }
  
}
