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
  roomAdmins: string[];
  private currentUser: string;
  isAdmin: boolean;


  constructor(private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomName = this.route.snapshot.params['roomName'];

    this.chatService.getJoinedUsersInChat().subscribe( users => {
      this.users = users.userArr;
      this.roomAdmins = users.opArr;
      this.currentUser = users.currentUser;

      // check if currentuser is an admin
      if (this.roomAdmins.indexOf(this.currentUser) >= 0) {
        this.isAdmin = true;
      }

    });

    this.chatService.updateChat().subscribe(info => {
      this.messageInfo = info.msg;
    });


    // redirect the correct kicked user to rooms/
    this.chatService.userKicked().subscribe(info => {
      if ((info.rName === this.roomName) && (info.userKicked === this.currentUser) && (info.isAdmin !== false) ) {
        this.router.navigate(['rooms']);
      }
    });

  }

  onLeaveRoom() {
    this.chatService.leaveRoom(this.roomName).subscribe();
    this.router.navigate(['/rooms']);
  }

  onSendMessage() {
    if (this.newMessage.length > 0) {
      this.chatService.sendMessage({ roomName: this.roomName, msg: this.newMessage }).subscribe();
    }
  }

  onKickUser(kickUser: string) {
    this.chatService.kickUser({user: kickUser, room: this.roomName}).subscribe();

  }



}
