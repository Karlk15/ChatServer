import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;
  loginFailed = false;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private toastrService: ToastrService,
    toastrConfig: ToastrConfig) {
      toastrConfig.timeOut = 1000;
      toastrConfig.maxOpened = 0;
  }

  ngOnInit() {
  }

  onLogin() {
    if (this.userName !== undefined && !(this.isEmptyOrSpaces(this.userName))) {
      this.chatService.login(this.userName).subscribe(succeeded => {
        this.loginFailed = !succeeded;
        if (succeeded === true) {
          this.router.navigate(['/rooms']);
        }
      });
    } else {
      this.loginFailed = true;
      this.userName = undefined;
      this.toastrService.error('Current username is unavailable', 'Error!');
    }
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
