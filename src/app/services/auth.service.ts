import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://presenteprofe.cl/api/v1';  // Ajuste para evitar la barra adicional

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  // Método auxiliar para obtener headers con token de autenticación
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authenticated');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Login de usuario
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
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Failed to log in'));
      })
    );
  }

  // Guardar token en el almacenamiento
  async saveToken(token: string): Promise<void> {
    await this.storage.set('auth_token', token);
  }

  // Obtener token del almacenamiento
  async getToken(): Promise<string | null> {
    return await this.storage.get('auth_token');
  }

  // Recuperar contraseña
  recuperarPassword(correo: string): Observable<any> {
    const body = { correo };
    return this.http.post(`${this.apiUrl}/recuperar`, body)
      .pipe(
        catchError((error) => {
          console.error('Error al recuperar contraseña:', error);
          return throwError(() => new Error('Failed to recover password'));
        })
      );
  }

  // Guardar perfil de usuario
  async saveUserProfile(perfil: string, nombre_completo: string): Promise<void> {
    await this.storage.set('user_perfil', perfil);
    await this.storage.set('nombre_completo', nombre_completo);
  }

  // Obtener información del usuario autenticado
  async getUserInfo(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/me`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo información del usuario:', error);
          return throwError(() => new Error('Failed to fetch user info'));
        })
      );
  }

  // Obtener el ID del usuario del almacenamiento
  async getUserId(): Promise<string | null> {
    return await this.storage.get('user_id');
  }

  // Obtener cursos por correo
  async getCursosPorCorreo(correo: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/cursos`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo cursos por correo:', error);
          return throwError(() => new Error('Failed to fetch courses'));
        })
      );
  }

  // Crear un nuevo curso
  async crearCurso(data: any): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/cursos`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear curso:', error);
          return throwError(() => new Error('Failed to create course'));
        })
      );
  }

  // Crear una nueva clase en un curso específico
  async crearClase(idCurso: number, claseData: any): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    const url = `${this.apiUrl}/cursos/${idCurso}/clase`;
    return this.http.post(url, claseData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear clase:', error);
          return throwError(() => new Error('Failed to create class'));
        })
      );
  }

  // Obtener cursos en los que el estudiante está inscrito
  async getCursosEstudiante(userId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    const url = `${this.apiUrl}/estudiantes/${userId}/cursos`;  // Corrige la URL si es necesario
    return this.http.get(url, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo cursos del estudiante:', error);
          return throwError(() => new Error('Failed to fetch student courses'));
        })
      );
  }

  // Método para matricularse en un curso utilizando un código
  async matricularseEnCurso(codigoCurso: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    const body = { codigoCurso };
    const url = `${this.apiUrl}/cursos/matricular`;  // Asegúrate de que sea el endpoint correcto
    return this.http.post(url, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al matricularse en el curso:', error);
          return throwError(() => new Error('Failed to enroll in course'));
        })
      );
  }

  // src/app/services/auth.service.ts
  async unirseACursoPorCodigo(codigoCurso: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    const url = `${this.apiUrl}/clases/${codigoCurso}/asistencia`;  // URL con el código del curso
    return this.http.post(url, {}, { headers })  // El cuerpo está vacío en este caso
      .pipe(
        catchError((error) => {
          console.error('Error al unirse al curso:', error);
          return throwError(() => new Error('Failed to join course'));
        })
      );
  }
  

}
