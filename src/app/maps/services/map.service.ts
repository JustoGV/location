import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private markers: Marker[] = []
  private map?: Map

  get isMapReady() {
    return !!this.map
  }

  constructor(private directionsApi:DirectionApiClient){}

  setMapa(mapa: Map) {
    this.map = mapa
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw new Error('mapa no se inicializo')

    this.map?.flyTo({
      zoom: 14,
      center: coords
    })
  }

  createMarkerFromPlaces(places: Feature[],userLocation:[number,number]) {

    if (!this.map) throw new Error('Mapa no inicializado')

    this.markers.forEach(marke => marke.remove())
    const newMarkers=[]

    for(const place of places){
      const [lng,lat]=place.center
      const popup=new Popup()
      .setHTML(`
      <h6>${place.text}</h6>
      <span>${place.place_name}</span>
      `)

      const newMarker= new Marker()
      .setLngLat([lng,lat])
      .setPopup(popup)
      .addTo(this.map)


      newMarkers.push(newMarker)
    }

    this.markers=newMarkers

    if(places.length===0) return

    const bounds=new LngLatBounds()
    newMarkers.forEach(marker=>bounds.extend(marker.getLngLat()))
    bounds.extend(userLocation)

    this.map.fitBounds(bounds,{
      padding:200
    })

  }

  getRouteBetweenPoints(start:[number,number], end:[number,number]){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
    .subscribe(res=>{
      // console.log(res,'res')
      this.drawPolyline(res.routes[0])
      // console.log(res.routes,'res')
    })
  }

  private drawPolyline(route: Route){

    if(!this.map) throw new Error('no existe mapa')

    // console.log(route,'route')
    const coords=route.geometry.coordinates

    const bounds= new LngLatBounds()

    coords.forEach((coord:[number,number])=>bounds.extend(coord))

    this.map.fitBounds(bounds,{
      padding:200
    })

    const sourceData:AnySourceData={
      type:'geojson',
      data:{
        type:'Feature',
        properties:{},
        geometry:{
          type:'LineString',
          coordinates:coords
        }
      }
    }

    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString')
      this.map.removeSource('RouteString')
    }

    this.map.addSource('RouteString',sourceData)

    this.map.addLayer({
      id:'RouteString',
      type:'line',
      source:'RouteString',
      layout:{
        'line-cap':'round',
        'line-join':'round',
      },
      paint:{
        'line-color':'black',
        'line-width': 3
      }
    })
  }
}
