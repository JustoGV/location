import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
mapboxgl.accessToken = 'pk.eyJ1IjoianVzdG9ndiIsImEiOiJjbGduczI3eXIwNXF0M2xvZ2ZkNDk3YnkzIn0.X-ngdSG1bN7QSgUEGxIPGQ';

if(!navigator.geolocation){
  alert('browser not available')
  throw new Error('browser not available')
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
