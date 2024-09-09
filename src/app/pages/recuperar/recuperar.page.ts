import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  username: string = ''; // Inicializar con una cadena vacía

  constructor(private route: ActivatedRoute, private router: Router) {} 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || ''; // Obtener el nombre de usuario de los parámetros de la URL
    });
  }

  Home() {
    this.router.navigate(['/home']);
  }
}
