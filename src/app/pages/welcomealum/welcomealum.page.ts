import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-welcomealum',
  templateUrl: './welcomealum.page.html',
  styleUrls: ['./welcomealum.page.scss'],
})
export class WelcomealumPage implements OnInit {
  username: string = ''; // Variable para el username
  items = [
    { title: 'Card title 1', text: 'Descripción de la tarjeta 1' },
    { title: 'Card title 2', text: 'Descripción de la tarjeta 2' },
    // Puedes añadir más ítems iniciales aquí
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

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
