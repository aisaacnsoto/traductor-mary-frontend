import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string;
  password: string;
  nombre: string;

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
  
  register(): void {
    if (this.username && this.password) {
      this.authService.register(this.username, this.password, this.nombre).subscribe(async (response) =>  {
        // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Bienvenido, '+response.usuario.nombre,
          buttons: this.alertButtons,
        });
    
        await alert.present();
        
      });
    } else {
      // Manejar caso donde el usuario no haya ingresado nombre de usuario o contraseña
      console.log('Por favor, ingrese nombre de usuario y contraseña.');
    }
  }

  ngOnInit(): void {
      
  }
}
