import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(private chatService: ChatService,
              private router: Router,
              private route: ActivatedRoute) { }

  roomName: string;

  ngOnInit() {
    this.roomName = this.route.snapshot.params['roomName'];
  }

  leaveRoom(){
    this.chatService.leaveRoom(this.roomName);
    this.router.navigate(["/rooms"]);
  }

}
