import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://presenteprofe.cl/api/v1';  // Ajuste para evitar la barra adicional

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  login(correo: string, password: string): Observable<any> {
    const body = { correo, password };
    return this.http.post(`${this.apiUrl}/auth`, body).pipe(
      tap(async (response: any) => {
        if (response.data) {
          await this.storage.set('user_id', response.data.id);
          if (response.auth && response.auth.token) {
            await this.storage.set('auth_token', response.auth.token);
          }
          await this.storage.set('user_perfil', response.data.perfil);
          await this.storage.set('nombre_completo', response.data.nombre_completo);
        }
      })
    );
  }

  async saveToken(token: string): Promise<void> {
    await this.storage.set('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get('auth_token');
  }

  recuperarPassword(correo: string): Observable<any> {
    const body = { correo };  // Envía el correo electrónico a la API
    return this.http.post(`${this.apiUrl}/recuperar`, body);
  }

  async saveUserProfile(perfil: string, nombre_completo: string): Promise<void> {
    await this.storage.set('user_perfil', perfil);
    await this.storage.set('nombre_completo', nombre_completo);
  }

  async getUserInfo(): Promise<Observable<any>> {
    const token = await this.getToken();  // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Agregar el token en los headers
    });

    return this.http.get(`${this.apiUrl}/auth/me`, { headers });  // Hacer la solicitud a la API con los headers
  }

  async getUserId(): Promise<string | null> {
    return await this.storage.get('user_id');
  }

  // Obtener cursos por correo
  async getCursosPorCorreo(correo: string): Promise<Observable<any>> {
    const token = await this.getToken(); // Obtener el token almacenado
    console.log('Token de autenticación:', token);  // Verificar que el token esté presente y correcto

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Usar el token en los headers
    });

    return this.http.get(`${this.apiUrl}/cursos`, { headers });
  }

  async getUserProfile(): Promise<string | null> {
    return await this.storage.get('user_perfil');
  }

  async crearCurso(data: any): Promise<Observable<any>> {
    const token = await this.getToken();  // Obtener el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Hacer la petición POST a la API para crear un nuevo curso
    return this.http.post(`${this.apiUrl}/cursos`, data, { headers });
  }
  
  
  
}
