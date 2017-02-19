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
  joinFailed = false;

  constructor(private chatService: ChatService, private router: Router, private toastrService: ToastrService, toastrConfig: ToastrConfig) {
      toastrConfig.timeOut = 2000;
      toastrConfig.maxOpened = 1;
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
    this.chatService.joinRoom({ room: roomName, pass: '' }).subscribe(joinInfo => {
      if (joinInfo.success === true) {
        this.joinFailed = false;
        this.router.navigate(['/room', roomName]);
      } else {
        this.joinFailed = true;
        this.joinFailReason = joinInfo.noJoinReason;
        this.toastrService.warning('Reason: ' + this.joinFailReason, 'Cannot join room');
      }
    });
  }

  onlogOut() {
    this.chatService.logOut().subscribe();
    this.router.navigate(['/login']);
  }

  onNewRoom() {
    if (this.newRoomName === undefined) {
      console.log('room name invalid');
    } else {
      this.chatService.addRoom(this.newRoomName).subscribe(succeeded => {
        if (succeeded === true) {
          this.onJoinRoom(this.newRoomName);
          this.router.navigate(['room', this.newRoomName]);
        }
      });
    }

  }


}
