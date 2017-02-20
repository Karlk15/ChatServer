import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig, ToastConfig } from 'ngx-toastr';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('childModal') public childModal: ModalDirective;
  roomName: string;
  messageInfo: any[];
  newMessage: string;
  users: string[];
  roomAdmins: string[];
  private currentUser: string;
  isAdmin: boolean;
  newPrivateMessage: string;
  sendPrvtToUser: string;
  topic: string;


  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private toastrConfig: ToastrConfig) {
    toastrConfig.timeOut = 0;
    toastrConfig.extendedTimeOut = 0;
    this.topic = 'No Topic';
  }


  ngOnInit() {
    this.roomName = this.route.snapshot.params['roomName'];

    this.chatService.getJoinedUsersInChat().subscribe(users => {
      this.users = users.userArr;
      this.roomAdmins = users.opArr;
      this.currentUser = users.currentUser;

      // check if currentuser is an admin
      if (this.roomAdmins.indexOf(this.currentUser) >= 0) {
        this.isAdmin = true;
      } else {
        // put to false so we can deop a previous admin
        this.isAdmin = false;
      }

    });

    this.chatService.updateChat().subscribe(info => {
      this.messageInfo = info.msg;
    });

    this.chatService.updatePrivateChat().subscribe(info => {
      try {
        this.toastrService.info(info.msg, info.nick);
      } catch (err) {
      }
    });

    this.scrollToBottom();

    // redirect the correct kicked user to rooms/
    this.chatService.userKicked().subscribe(info => {
      if ((info.rName === this.roomName) && (info.userKicked === this.currentUser)) {
        this.router.navigate(['rooms']);
      }
    });

    // redirect the correct banned user to rooms/
    this.chatService.userBanned().subscribe(info => {
      if ((info.rName === this.roomName) && (info.userBanned === this.currentUser)) {
        this.router.navigate(['rooms']);
      }
    });

  }

  onLeaveRoom() {
    this.chatService.leaveRoom(this.roomName).subscribe();
    this.router.navigate(['/rooms']);
  }

  onSendMessage() {
    if (this.newMessage !== undefined) {
      this.chatService.sendMessage({ roomName: this.roomName, msg: this.newMessage }).subscribe();
      this.newMessage = undefined;
    }
    this.scrollToBottom();
  }

  onSendPrvtMessage() {
    if (this.newPrivateMessage !== undefined && this.sendPrvtToUser !== this.currentUser) {
      this.chatService.sendPrvtMessage({ nick: this.sendPrvtToUser, message: this.newPrivateMessage }).subscribe(succeeded => {
        if (succeeded) {
          this.hideChildModal();
        }
      });
      this.newPrivateMessage = undefined;
    }
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  onKickUser(kickUser: string) {

    // check if user being kicked is a admin
    if (this.roomAdmins.indexOf(kickUser) < 0) {
      this.chatService.kickUser({ user: kickUser, room: this.roomName }).subscribe();
    } else {
      // TODO put html popup when trying to kick admin
      console.log('cannot kick admin');
    }


  }

  onBanUser(banUser: string) {
    // check if user being banned is a admin
    if (this.roomAdmins.indexOf(banUser) < 0) {
      this.chatService.banUser({ user: banUser, room: this.roomName }).subscribe();
    } else {
      // TODO put html popup when trying to ban admin
      console.log('cannot ban admin');
    }

  }

  onOpUser(opUser: string) {
    this.chatService.opUser({ user: opUser, room: this.roomName }).subscribe();
  }

  onDeOpUser(opUser: string) {
    if (this.currentUser !== opUser) {
      this.chatService.deOpUser({ user: opUser, room: this.roomName }).subscribe();
    }

  }

  getPrvtSendToUser(User: string) {
    this.sendPrvtToUser = User;
  }

  public showChildModal(Admin: string): void {
    if (this.currentUser !== Admin) {
      this.childModal.show();
    } else {
      try {
        const warningConfig: ToastConfig = { timeOut: 2000, extendedTimeOut: 2000 };
        this.toastrService.warning('Cannot send private message to yourself', '', warningConfig);
      } catch (err) {
      }
    }
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

}
