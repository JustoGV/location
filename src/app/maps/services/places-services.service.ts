import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';
declare var cordova:any

@Injectable({
  providedIn: 'root'
})
export class PlacesServicesService {
  public userLocation?: [number, number]
  public isLoading:boolean=false
  public places: Feature[]=[]
  public beaconInfo:any={}
  
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

      navigator.geolocation.watchPosition(
        ({ coords }) => {
          // console.log(coords,'coords')
          this.userLocation = [coords.latitude, coords.longitude]
          this.userLocation.reverse()
          // console.log(this.userLocation)
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

  // getBeacon(){
  //    // Define el UUID del Beacon a detectar
  //    const beaconUuid = '1234';

  //    // Escanea para detectar el Beacon
  //    cordova.plugins.BluetoothLE.scan([], 10, (device) => {
  //      if (device.name === beaconUuid) {
  //        // Almacena la información del Beacon detectado
  //        this.beaconInfo = device;
 
  //        // Calcula la distancia y la dirección del Beacon en relación con el dispositivo móvil
  //        let distance = Math.pow(10, ((-69 - (device.rssi)) / (10 * 2)));
  //        let direction = (device.rssi > -75) ? 'Norte' : 'Oeste';
 
  //        // Muestra la información del Beacon en la consola
  //        console.log(`Beacon detectado: ${device.id}, distancia: ${distance} metros, dirección: ${direction}`);
 
  //        // Detiene el escaneo una vez que se detecta el Beacon
  //        cordova.plugins.BluetoothLE.stopScan(() => {
  //          console.log('Escaneo detenido');
  //        }, (error) => {
  //          console.log(`Error al detener el escaneo: ${error}`);
  //        });
  //      }
  //    }, (error) => {
  //      console.log(`Error al escanear BLE: ${error}`);
  //    });
  // }
}
