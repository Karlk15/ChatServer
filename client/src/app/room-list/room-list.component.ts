import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  rooms: string[];
  users: string[];
  newRoomName: string;
  joinFailReason: string;
  joinFailed = false;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });

    this.chatService.getAllConnectedUsers().subscribe(userList => {
      this.users = userList;
    });
  }


  onJoinRoom(roomName: string) {
    if (roomName !== undefined || this.newRoomName !== undefined) {
      let roomInfo: any;

      if(roomName === undefined){
        roomInfo = {
          room: this.newRoomName,
          pass: ''
        };
      } else {
        roomInfo = {
          room: roomName,
          pass: ''
        };
      }


      this.chatService.joinRoom(roomInfo).subscribe(joinInfo => {
        if (joinInfo.success === true) {
          this.joinFailed = false;
          this.router.navigate(['/room', roomInfo.room]);
        } else {
          // TODO popup stating why you cannot enter room
          this.joinFailed = true;
          this.joinFailReason = joinInfo.noJoinReason;
        }
      });
      this.newRoomName = undefined;
    } else {
      // TOESTER
    }

  }

  onlogOut() {
    this.chatService.logOut().subscribe();
    this.router.navigate(['/login']);
  }



}
