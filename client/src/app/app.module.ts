import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';
import { ButtonsModule } from 'ng2-bootstrap';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomListComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpModule,
    ButtonsModule.forRoot(),
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }, {
        path: 'login',
        component: LoginComponent
      }, {
        path: 'rooms',
        component: RoomListComponent
      }, {
        path: 'room/:roomName',
        component: RoomComponent
      }])
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
