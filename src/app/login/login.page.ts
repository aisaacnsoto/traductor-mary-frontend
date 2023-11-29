import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
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
        this.router.navigate(['/home/tabs/tab2']);
      },
    },
  ];

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    ) {
      this.validarLogin();
    }
  
  async validarLogin() {
    if (await this.authService.isLoggedIn()) {
      this.router.navigate(['/home/tabs/tab2']);
    }
  }

  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(async (response) =>  {
        // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Hola de nuevo, '+response.usuario.nombre,
          buttons: this.alertButtons,
        });
    
        await alert.present();
        
      });
    } else {
      // Manejar caso donde el usuario no haya ingresado nombre de usuario o contraseña
      console.log('Por favor, ingrese nombre de usuario y contraseña.');
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
      
  }
}
