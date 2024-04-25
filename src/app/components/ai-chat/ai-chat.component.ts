import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent implements OnInit {
  isRecording = false;
  room: Room | undefined;

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
}
