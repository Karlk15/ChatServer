import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080');
    this.socket.on('connect', function() {
      console.log('connect');
    });
  }

  login(userName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('adduser', userName, succeeded => {
        observer.next(succeeded);
      });
    });
    return observable;
  }

  logOut() {
    const observable = new Observable(observer => {
      this.socket.emit('disconnect');
    });
    return observable;
  }

  getRoomList(): Observable<string[]> {
    const observable = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const strArr: string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(x);
          }
        }
        observer.next(strArr);
      });
    });
    return observable;
  }

  joinRoom(roomInfo: any): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('joinroom', roomInfo, (succeeded, reason) => {
        observer.next(succeeded);
      });
    });
    return observable;
  }

  addRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      // TODO validate roomName
      const param = {
        room: roomName
      };
      this.socket.emit('joinroom', param, function(a, b) {
        observer.next(a);
      });
    });
    return observable;
  }

  leaveRoom(roomName: string) {
    const observable = new Observable(observer => {
      this.socket.emit('partroom', roomName);
    });
    return observable;
  }

  getAllConnectedUsers(): Observable<string[]> {
    const observable = new Observable(observer => {
      this.socket.emit('users');

      this.socket.on('userlist', (users) => {

        // converting the string to an object so we can use for-in loop on it
        /*const obj = lst.reduce(function(acc, cur, i) {
          acc[i] = cur;
          return acc;
        }, {});*/

        const strArr: string[] = [];
        for (let i = 0; i < users.length; i++) {
          if (users.hasOwnProperty(i)) {
            strArr.push(users[i]);
          }
        }
        observer.next(strArr);
      });

    });
    return observable;
  }

  getJoinedUsersInChat(): Observable<string[]> {
    const observable = new Observable(observer => {
      this.socket.emit('updateusers', (roomName, users, ops) => {
        const strArr: string[] = [];
        for (let i = 0; i < users.length; i++) {
          if (users.hasOwnProperty(i)) {
            strArr.push(users[i]);
          }
        }
        observer.next(strArr);
      });
    });
    return observable;
  }

  sendMessage(messageInfo: any) {
    console.log(messageInfo);
  }

}
