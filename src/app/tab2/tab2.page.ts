import { Component } from '@angular/core';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { PhotoService, UserPhoto } from '../services/photo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  apiUrl = environment.apiURL;

  constructor(
    public photoService: PhotoService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private http: HttpClient,
    ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async onButtonClick(item: UserPhoto): Promise<void> {
    let base64 = item.base64?.replace("data:image/png;base64,", "");
    const imageData = { imagen: base64 };

    const loading = await this.loadingController.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
    });

    await loading.present();

    this.http.post(`${this.apiUrl}/cargar_imagen`, imageData).subscribe({
      next: async (value: any) => {
        await loading.dismiss();

        // Maneja la respuesta según tus necesidades
        const toast = await this.toastController.create({
          message: `Traducción: ${value.translation}`,
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
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
