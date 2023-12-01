import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;

  public alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.username = '';
        this.password = '';
        this.router.navigate(['/home/tabs/tab2']);
      },
    },
  ];

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    ) {
      this.validarLogin();
    }
  
  async validarLogin() {
    if (await this.authService.isLoggedIn()) {
      this.router.navigate(['/home/tabs/tab2']);
    }
  }

  async login(): Promise<void> {
    
    if (this.username && this.password) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
      });
  
      await loading.present();

      this.authService.login(this.username, this.password).subscribe(async (response) =>  {
        await loading.dismiss();
        // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Hola de nuevo, '+response.usuario.nombre,
          buttons: this.alertButtons,
        });
    
        await alert.present();
        
      });
    } else {
      const alert = await this.alertController.create({
        header: 'Rellene los campos',
        message: 'Por favor, ingrese nombre de usuario y contraseña.',
        buttons: ['Ok']
      });
  
      await alert.present();
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
      
  }
}
