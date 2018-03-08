import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataApiService {

  constructor(private http: Http,) {}

  url:string =environment.url;

  top100() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${this.url}/data/getall`, {headers: headers})
      .map(res => res.json());
  }

}