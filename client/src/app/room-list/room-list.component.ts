import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

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

  constructor(private chatService: ChatService, private router: Router, private toastrService: ToastrService, toastrConfig: ToastrConfig) {
      toastrConfig.timeOut = 1000;
      toastrConfig.maxOpened = 0;
   }

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

      if (roomName === undefined) {
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
          this.router.navigate(['/room', roomInfo.room]);
        } else {
          this.joinFailReason = joinInfo.noJoinReason;
          try {
            this.toastrService.warning('Reason: ' + this.joinFailReason, 'Cannot join room');
          } catch ( err ) {
          }
        }
      });
      this.newRoomName = undefined;
    } else {
      try {
          this.toastrService.warning('Please specify a room name', 'Invalid Name');
      } catch ( err ) {
      }
    }

  }

  onlogOut() {
    this.chatService.logOut().subscribe();
    this.router.navigate(['/login']);
  }



}
