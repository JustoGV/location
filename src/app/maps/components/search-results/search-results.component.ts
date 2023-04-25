import { Component } from '@angular/core';
import { MapService, PlacesServicesService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public selectedId:string=''

  constructor(
    private placesServices:PlacesServicesService,
    private mapService:MapService
    ){ }

  get isLoadinPlaces():boolean{
    return this.placesServices.isLoading
  }
 
  get places():Feature[]{
    return this.placesServices.places
  }

  
  flyTo(place: Feature){
    this.selectedId=place.id
    const [lng,lat]=place.center
    this.mapService.flyTo([lng,lat])

  }

  getDirections(place:Feature){
    if(!this.placesServices.userLocation) throw new Error('No hay ubicacion del usuario')

    this.placesServices.deltePlaces()

    const start= this.placesServices.userLocation
    const end=place.center as [number,number]
    // console.log(start,'start')
    // console.log(place.center,'end')
    
    this.mapService.getRouteBetweenPoints(start,end)
  }
}
