import { Component } from '@angular/core';
import { ChatContainerComponent } from '../../components/chat-container/chat-container.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ChatType } from '../../types/chat.types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatContainerComponent, UserListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  chatType: ChatType | undefined;

  handleSetChat(e: any) {
    this.chatType = ChatType.USER;
  }
}
