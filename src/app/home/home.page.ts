import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database, object, ref, onValue, Unsubscribe, set } from '@angular/fire/database';

// Definir interfaz para la habitación
interface Habitacion {
  nombre: string;
  luz: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // Definir array de habitaciones con la interfaz Habitacion
  habitaciones: Habitacion[] = [
    { nombre: 'Habitación', luz: false },
    { nombre: 'Sala de estar', luz: false },
    { nombre: 'Cocina', luz: false },
    { nombre: 'Comedor', luz: false },
    { nombre: 'Estudio', luz: false },
    { nombre: 'Cochera', luz: false }
  ];

  constructor(private database: Database) {}
  firebaseSubscription!: Unsubscribe;

  ngOnInit() {
    const route = ref(this.database, "/Hogar");
    this.firebaseSubscription = onValue(route, snapshot => {
      const valores_db = snapshot.val();
      this.actualizarEstado(valores_db);
    });
  }
  actualizarEstado(valores: any) {
    for (let habitacion in valores) {
      const index = this.habitaciones.findIndex(hab => hab.nombre.toLowerCase() === habitacion.toLowerCase());
      if (index !== -1) {
        this.habitaciones[index].luz = valores[habitacion];
      }
    }
  }
  ngOnDestroy() {
    if (this.firebaseSubscription) {
      this.firebaseSubscription();
    }
  }
}