import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserChatComponent } from '../user-chat/user-chat.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ChatType } from '../../types/chat.types';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, UserChatComponent, AiChatComponent],
  templateUrl: './chat-container.component.html',
})
export class ChatContainerComponent {
  @Input() chatType: ChatType | undefined;
  public ChatType = ChatType;
}
