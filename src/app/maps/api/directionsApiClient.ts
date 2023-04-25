import { Injectable } from "@angular/core";
import {HttpClient, HttpHandler, HttpParams} from "@angular/common/http"
import { enviroment } from "src/enviroments/enviroment";


@Injectable({
    providedIn:'root',
})
export class DirectionApiClient extends HttpClient{

    public baseUrl: string='https://api.mapbox.com/directions/v5/mapbox/driving'

    constructor(handler: HttpHandler){
        super(handler);
    }

    public override get<T>(url:string){
        url=this.baseUrl+url
        
        // console.log(url,'url')
        return super.get<T>(url,{
            params:{
                alternatives:false,
                geometries:'geojson',
                language:'en',
                overview:'simplified',
                steps:true,
                access_token: enviroment.apiKey,
            }
        })
    }

}