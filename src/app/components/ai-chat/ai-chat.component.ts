import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Room } from 'livekit-client';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    const wsURL = environment.liveKitUrl;
    const token = environment.SECRET_LIVE_KIT_TOKEN;

    const room = new Room();
    await room.connect(wsURL, token);
    console.log('connected to room', room.name);

    // publish local camera and mic tracks
    await room.localParticipant.enableCameraAndMicrophone();
  }
}
