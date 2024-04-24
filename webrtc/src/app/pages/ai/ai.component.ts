import { Component, OnInit } from '@angular/core';
import { RtcService } from '../../core/rtc-service/rtc.service';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss'
})
export class AiComponent implements OnInit {
  constructor(
    private rtc: RtcService
  ) {
  }
  ngOnInit(): void {}
}
