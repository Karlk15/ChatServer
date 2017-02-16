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
        console.log('Reply received');
        observer.next(succeeded);
      });
    });
    return observable;
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
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
    return obs;
  }

  joinRoom(roomInfo: any): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('joinroom', roomInfo, (succeeded, reason) => {
        observer.next(succeeded);
      });
    });
    return observable;
  }

  addRoom(roomName: string) {
      // TODO validate roomName
      const param = {
        room: roomName
      };
      this.socket.emit('joinroom', param, function(a, b) {
            if (!a) {
                console.log('addRoom failed');
            }
      });
  }

  leaveRoom(roomName: string) {
    const observable = new Observable(observer => {
      this.socket.emit('partroom', roomName);
    });
    return observable;
  }

  getAllConnectedUsers() {
    const observable = new Observable(observer => {
      this.socket.emit('users');

      this.socket.on('userlist', (lst) => {
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

}
