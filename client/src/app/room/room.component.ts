import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  roomName: string;
  messageInfo: any[];
  newMessage: string;
  users: string[];
  roomAdmins: string[];


  constructor(private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomName = this.route.snapshot.params['roomName'];

    this.chatService.getJoinedUsersInChat().subscribe( users => {
      this.users = users.userArr;
      this.roomAdmins = users.opArr;
    });

    this.chatService.updateChat().subscribe(info => {
      this.messageInfo = info.msg;
    });

    this.scrollToBottom();
  }

  onLeaveRoom() {
    this.chatService.leaveRoom(this.roomName).subscribe();
    this.router.navigate(['/rooms']);
  }

  sendMessage() {
    if (this.newMessage.length > 0) {
      this.chatService.sendMessage({ roomName: this.roomName, msg: this.newMessage }).subscribe();
    }
    this.scrollToBottom();
  }

  scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
}
