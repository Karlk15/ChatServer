import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomName: string;
  newMessage: string;
  users: string[];

  constructor(private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomName = this.route.snapshot.params['roomName'];

    this.chatService.getJoinedUsersInChat().subscribe(lst => {
      this.users = lst;
    });
  }

  leaveRoom() {
    this.chatService.leaveRoom(this.roomName);
    this.router.navigate(['/rooms']);
  }

  sendMessage() {
    this.chatService.sendMessage({ roomName: this.roomName, msg: this.newMessage });
  }

}
