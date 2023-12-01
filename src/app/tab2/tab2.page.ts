import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { PhotoService, UserPhoto } from '../services/photo.service';
import { TraduccionService } from '../services/traduccion.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  apiUrl = environment.apiURL;
  usuario: User;
  nombreUsuario = '';

  constructor(
    private authService: AuthService,
    public photoService: PhotoService,
    private traduccionService: TraduccionService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private http: HttpClient,
    private router: Router
    ) {
      this.getUser();
    }
  
  

  async getUser() {
    this.usuario = await this.authService.getUserFromStorage();
    this.nombreUsuario = this.usuario.nombre;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  async ngOnInit() {
    await this.photoService.loadSaved();
    this.getUser();
  }

  async addPhotoToGallery() {
    await this.photoService.addNewToGallery();
    this.router.navigate(['/home/tabs/tab3']);
    this.onButtonClick(this.photoService.photos[0]);
  }

  async onButtonClick(item: UserPhoto): Promise<void> {
    let base64 = item.base64?.replace("data:image/png;base64,", "");
    const imageData = { imagen: base64, usuario: this.usuario.usuario };

    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });

    await loading.present();

    this.http.post(`${this.apiUrl}/cargar_imagen`, imageData).subscribe({
      next: async (value: any) => {
        await loading.dismiss();
        this.traduccionService.texto = value.texto_reconocido;
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

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
          }
      }]
    });
    await actionSheet.present();
  }

}
