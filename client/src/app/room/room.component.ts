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
  messageInfo: any[];
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
    this.chatService.updateChat().subscribe(info => {
      this.messageInfo = info.msg;
    });
  }

  onLeaveRoom() {
    this.chatService.leaveRoom(this.roomName).subscribe();
    this.router.navigate(['/rooms']);
  }

  sendMessage() {
    if (this.newMessage.length > 0) {
      this.chatService.sendMessage({ roomName: this.roomName, msg: this.newMessage }).subscribe();
    }
  }
}
