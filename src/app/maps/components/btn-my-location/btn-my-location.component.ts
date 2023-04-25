import { Component } from '@angular/core';
import { MapService, PlacesServicesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(
    private mapService:MapService,
    private placesService:PlacesServicesService
    ){ }

  goToMyLocation(){
    if(!this.placesService.getUserLocation) throw new Error('No hay ubicacion de usuario')
    if(!this.mapService.isMapReady) throw new Error('No hay mapa')

    this.mapService.flyTo(this.placesService.userLocation!)
  }

}
