import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getChatByRoom(room) {
    return this.http.get(this.url + '/' + room);
  }

  saveChat(data) {
    return  this.http.post(this.url + '/', data);
  }
}
