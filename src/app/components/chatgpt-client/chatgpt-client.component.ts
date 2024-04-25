import { Component, OnInit } from '@angular/core';
import { Room } from 'livekit-client';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chatgpt-client',
  standalone: true,
  imports: [],
  templateUrl: './chatgpt-client.component.html',
})
export class ChatgptClientComponent implements OnInit {
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
