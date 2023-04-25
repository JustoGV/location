import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesServicesService {
  public userLocation?: [number, number]
  public isLoading:boolean=false
  public places: Feature[]=[]
  
  get isUserLocationReady(): boolean {
    return !!this.userLocation
  }

  constructor(
    private placesapi:PlacesApiClient,
    private mapService:MapService
    ) { this.getUserLocation() }

  public getUserLocation(): Promise<[number, number]> {

    //PROBAR CON WATCHPOSITION DESPUES

    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          // console.log(coords,'coords')
          this.userLocation = [coords.latitude, coords.longitude]
          this.userLocation.reverse()
          resolve(this.userLocation)
        },
        (err) => {
          alert('no se pudo tener la geolocalizacion')
          console.log(err)
          reject()
        }

      )
    })
  }

  getPlacesByQuery(query: string = '') {

    if(query.length===0){
      this.isLoading=false
      this.places=[]
      return
    }

    if(!this.userLocation) throw new Error('No existe ubicacion del usuario')

    this.isLoading=true


    this.placesapi.get<PlacesResponse>(`/${query}.json`,{
      params:{
        proximity:this.userLocation.join(',')
      }
    })
    .subscribe((res)=>{
      // console.log(res.features)
      this.isLoading=false
      this.places=res.features

      this.mapService.createMarkerFromPlaces(this.places,this.userLocation)
    })
  }

  deltePlaces(){
    this.places=[]
  }
}
