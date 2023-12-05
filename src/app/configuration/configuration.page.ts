import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {

  apiUrl: string = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.validarConfig();
  }

  async guardarConfig() {
    await Preferences.set({
      key: 'api_url',
      value: this.apiUrl
    });
    this.navegarAlLogin();
  }

  async validarConfig() {
    const { value } = await Preferences.get({ key: 'api_url' });
    if (value) {
      this.navegarAlLogin();
    }
  }

  navegarAlLogin() {
    this.router.navigate(['/login']);
  }

}
