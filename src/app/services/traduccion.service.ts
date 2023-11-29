import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TraduccionService {

  texto: string;
  idioma: string = 'es';

  constructor() { }
}
