import { Component } from '@angular/core';
import { PlacesServicesService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent {

  constructor( private placesService:PlacesServicesService){ }

  get isUserLocationReady(){
    return this.placesService.isUserLocationReady
  }
}
