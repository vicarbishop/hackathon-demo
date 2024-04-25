import { Component, EventEmitter, Injectable, Output, Inject } from '@angular/core';
import { ChatType } from '../../types/chat.types';
import { RtcService } from '../../core/services/rtc-service/rtc.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  providers: [ RtcService ]
})
export class UserListComponent {
  @Output() setChat = new EventEmitter<ChatType>();
  ChatType = ChatType;
  loading: boolean = false;
  error: any;

  constructor(public rtcService: RtcService) { }

  setChatType(type: ChatType) {
    this.setChat.emit(type);
  }

  async ngOnInit() {
      this.getUserList();
  }

  async getUserList() {
    this.rtcService.getUserList().subscribe({
      next: (data) => {
        this.loading = true;
        //Set the dropdown filter values
        console.log(data);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
