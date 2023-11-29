import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    const body = { usuario: username, clave: password };
    return this.http.post<any>(`${this.apiUrl}/login`, body)
      .pipe(
        tap(response => this.handleSuccess(response)),
        catchError(error => this.handleError(error))
      );
  }

  register(username: string, password: string, nombre: string): Observable<any> {
    const body = { usuario: username, clave: password, nombre: nombre };
    return this.http.post<any>(`${this.apiUrl}/registro`, body)
      .pipe(
        tap(response => this.handleSuccess(response)),
        catchError(error => this.handleError(error))
      );
  }

  private async handleSuccess(response: any): Promise<void> {
    // Manejar lógica de éxito aquí, por ejemplo, almacenar token de sesión, etc.
    await this.saveUserInStorage(response.usuario as User);
  }

  private handleError(error: any): Observable<any> {
    console.error('Error:', error);
    return of({ error: 'Ocurrió un error. Por favor, inténtalo de nuevo.' });
  }

  private async saveUserInStorage(user: User): Promise<void> {
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user)
    });
  }

  async getUserFromStorage(): Promise<User> {
    const { value } = await Preferences.get({ key: 'user' });
    return (value ? JSON.parse(value) : {}) as User;
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await Preferences.get({ key: 'user' });
    return user && user.value !== null;
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'user' });
  }

}

export interface User {
  usuario: string;
  clave: string;
  nombre: string;
}