import { Component, EventEmitter, Output } from '@angular/core';
import { ChatType } from '../../types/chat.types';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Output() setChat = new EventEmitter<ChatType>();
  ChatType = ChatType;

  setChatType(type: ChatType) {
    this.setChat.emit(type);
  }
}
