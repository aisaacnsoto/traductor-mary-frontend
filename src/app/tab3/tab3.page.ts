import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { TraduccionService } from '../services/traduccion.service';
import { environment } from 'src/environments/environment';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  apiUrl = environment.apiURL;
  usuario: User;

  itemSeleccionado: string = 'spanish';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private http: HttpClient,
    public traduccionService: TraduccionService,
    private router: Router
  ) {
    this.getUser();
  }

  async getUser() {
    this.usuario = await this.authService.getUserFromStorage()
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  async procesarFormulario(): Promise<void> {
    const data = {
      texto: this.traduccionService.texto,
      idioma: this.traduccionService.idioma,
      usuario: this.usuario.usuario
    };

    const loading = await this.loadingController.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
    });

    await loading.present();

    this.http.post(`${this.apiUrl}/traducir`, data, { responseType: 'blob' }).subscribe({
      next: async (value: any) => {
        await loading.dismiss();
        
        const audio = new Audio();
        const blob = new Blob([value], { type: 'audio/mp3' });
        audio.src = URL.createObjectURL(blob);
        audio.load();
        audio.play();
      },
      error: async (err) => {
        // Maneja los errores
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: `Error al hacer la petición.`,
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async reproducirAudio(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
    });

    await loading.present();

    this.http.get(`${this.apiUrl}/audio`, { responseType: 'blob' }).subscribe(data => {
      loading.dismiss();
      const audio = new Audio();
      const blob = new Blob([data], { type: 'audio/mp3' });
      audio.src = URL.createObjectURL(blob);
      audio.load();
      audio.play();
    });
  }

}