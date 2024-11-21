import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import md5 from 'md5';

@Injectable({
  providedIn: 'root',
})
export class MarvelService {
  private apiUrl = 'https://gateway.marvel.com/v1/public';
  private publicKey = 'dfeee3bac7f9921cf4b90424645e8a40';
  private privateKey = '08a5147d0437aebdba8adf7e90c64d7e151cda3b';

  constructor(private http: HttpClient) {}
  getCharacters(limit: number, offset: number): Observable<any> {
    const ts = new Date().getTime().toString();
    const hash = md5(ts + this.privateKey + this.publicKey);
    const params = new HttpParams()
      .set('ts', ts)
      .set('apikey', this.publicKey)
      .set('hash', hash)
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    return this.http.get(`${this.apiUrl}/characters`, { params });
  }
}
