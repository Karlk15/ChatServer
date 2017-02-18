import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

  socket: any;
  newUser: string;
  currentRoom: string;

  constructor() {
    this.socket = io('http://localhost:8080');
    this.socket.on('connect', function() {
      console.log('connect');
    });
  }

  login(userName: string): Observable<boolean> {
    this.newUser = userName;
    const observable = new Observable(observer => {
      this.socket.emit('adduser', this.newUser, succeeded => {
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
        observer.next(Object.keys(lst));
      });
    });
    return observable;
  }

  joinRoom(roomInfo: any): Observable<boolean> {
    this.currentRoom = roomInfo.room;
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

  getJoinedUsersInChat(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('updateusers', (roomName, users, ops) => {

        // sending back object with op of the room and array of users in room
        const usersInfo = {
          userArr: Object.keys(users),
          opArr: Object.keys(ops),
          currentUser: this.newUser
        };

        observer.next(usersInfo);
      });

    });
    return observable;
  }

  sendMessage(messageInfo: any) {
    const observable = new Observable(observer => {
      this.socket.emit('sendmsg', messageInfo);
    });

    return observable;
  }

  updateChat(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('updatechat', (roomName, message) => {

        const chatInfo = {
          rName: roomName,
          msg: message
        };
        if (this.currentRoom === roomName) {
          observer.next(chatInfo);
        }
      });
    });

    return observable;
  }

  kickUser(kickUserInfo: any): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('kick', kickUserInfo, succeeded => {
        observer.next(succeeded);
      });
    });
    return observable;
  }

  userKicked(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('kicked', (roomName, kickedName, op) => {

        const kickInfo = {
          rName: roomName,
          userKicked: kickedName,
          admin: op
        };

        observer.next(kickInfo);
      });
    });

    return observable;
  }

}
