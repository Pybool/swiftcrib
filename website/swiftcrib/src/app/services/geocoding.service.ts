import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  getCoordinates(address: string) {
    const apiKey = 'AIzaSyBZIJA4tIuQq82VLoSCBYsQE1bve2pzwMo';
    const encodedAddress = encodeURIComponent(address);
    const url = `${this.apiUrl}?address=${encodedAddress}&key=${apiKey}`;
    return this.http.get(url);
  }
}


