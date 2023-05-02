import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesServicesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';
// const Bluetooth	= require('node-web-bluetooth');




@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapDivElement!: ElementRef
  // dispositivos = [];
  device: any;
  location: string;
  mobileNavigatorObject: any = window.navigator;

  constructor(
    private placesService: PlacesServicesService,
    private mapService: MapService
  ) { }


  //OBTENER LA UBI DEL BLE


  async connectToDevice() {
    try {
      // Busca el dispositivo BLE
      this.device = await this.mobileNavigatorObject.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]
      });

      // Conecta al dispositivo BLE
      await this.device.gatt.connect();

      // Obtiene la característica de ubicación del dispositivo
      const service = await this.device.gatt.getPrimaryService('location_service');
      const characteristic = await service.getCharacteristic('location_characteristic');

      // Lee el valor de la característica
      const value = await characteristic.readValue();
      this.location = value.getUint8(0);

      // Desconecta del dispositivo BLE
      await this.device.gatt.disconnect();
    } catch (error) {
      console.error(error);
    }
  }


  // buscarDispositivos() {

  //   this.mobileNavigatorObject.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  //     .then(device => {
  //       console.log(device,'device');
  //       this.dispositivos.push(device);
  //     })
  //     .catch(error => console.log(error));
  // }
  ngAfterViewInit(): void {

    if (!this.placesService.userLocation) throw new Error('No hay userLocation')

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });
    // if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
    //   // Here write your logic of mobileNavigatorObject.bluetooth.requestDevice();

    //   // mobileNavigatorObject.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
    //   //   .then((device:any) => {
    //   //     // Conectar al dispositivo BLE y obtener las coordenadas
    //   //     return device.gatt!.connect();
    //   //   })
    //   //   .then((server:any) => {
    //   //     // Obtener el servicio de batería
    //   //     return server.getPrimaryService('battery_service');
    //   //   })
    //   //   .then((service:any) => {
    //   //     // Obtener el nivel de batería
    //   //     return service.getCharacteristic('battery_level');
    //   //   })
    //   //   .then((characteristic:any) => {
    //   //     // Obtener las coordenadas del dispositivo BLE detectado
    //   //     let coords = characteristic.value;

    //   //     // Crear un marcador en el mapa utilizando las coordenadas del dispositivo BLE detectado
    //   //     const el = document.createElement('div');
    //   //     el.className = 'marker';

    //   //     new Marker(el)
    //   //       .setLngLat([coords.lng, coords.lat])
    //   //       .addTo(map);
    //   //   })
    //   //   .catch(error => {
    //   //     console.error(error);
    //   //   });
    // }


    //--------------------------------------------

    const popup = new Popup()
      .setHTML(`
      <h6>Aqui estoy</h6>
      <span>Estoy en este lugar del mundo</span>
      `)

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map)

    this.mapService.setMapa(map)
  }
}
