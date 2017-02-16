import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  constructor(private chatService: ChatService, private router: Router) { }

  rooms: string[];
  users: string[];
  joinFailReason: string;
  joinFailed: boolean = false;

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });

    /*this.chatService.getAllConnectedUsers().subscribe(lst => {
      this.users = lst;
    });*/
  }

  onJoinRoom(roomName: string) {
    this.chatService.joinRoom({ room: roomName, pass: '' }).subscribe(succeeded => {
      if (succeeded === true) {
        this.joinFailed = false;
        this.router.navigate(['/room', roomName]);
      } else {
        this.joinFailed = true;
        this.joinFailReason = 'placeholder';
      }
    });
  }

}
