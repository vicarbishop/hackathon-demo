import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../types/chat.types';
import { FormsModule } from '@angular/forms';
import { ChatGPTService } from '../../core/services/chat-gpt.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent implements OnInit {
  isRecording = false;
  room: Room | undefined;
  messageQueue = new Array<ChatMessage>();
  textAreaMsg = '';

  constructor(private chatGPTService: ChatGPTService) {}

  async ngOnInit(): Promise<void> {
    const wsURL = environment.liveKitUrl;
    const token = environment.SECRET_LIVE_KIT_TOKEN;

    this.room = new Room();
    await this.room.connect(wsURL, token);
    console.log('connected to room', this.room.name);

    this.room.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
  }

  async setRecording(rec: boolean) {
    this.isRecording = rec;
    this.room!.localParticipant.setMicrophoneEnabled(rec);
  }

  handleTrackSubscribed(
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) {
    /* do things with track, publication or participant */
    const element = track.attach();
    document.getElementById('playback')!.appendChild(element);
  }

  addToMessageQueue(message: string, sender: string) {
    this.messageQueue.push(new ChatMessage(message, sender));
  }

  async sendTextMessage() {
    this.addToMessageQueue(this.textAreaMsg, 'You');

    let response = await this.chatGPTService.communeWithTheAIGods(
      this.textAreaMsg
    );
    let resp = response.choices[0].message.content;
    this.addToMessageQueue(resp, 'Dot Assistant');
    this.textAreaMsg = '';
  }
}
