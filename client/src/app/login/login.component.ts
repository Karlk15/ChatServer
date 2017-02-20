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
    private toastrConfig: ToastrConfig) {
    toastrConfig.positionClass = 'toast-top-right';
  }

  ngOnInit() {
  }

  onLogin() {
    if (this.userName !== undefined) {
      this.chatService.login(this.userName).subscribe(succeeded => {
        this.loginFailed = !succeeded;
        if (succeeded === true) {
          this.router.navigate(['/rooms']);
        }
      });
    } else {
      this.loginFailed = true;
      this.toastrService.error('Current username is taken', 'Error!');
    }
  }
}
