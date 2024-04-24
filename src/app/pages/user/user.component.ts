import { Component, OnInit } from '@angular/core';
import { RtcService } from '../../core/services/rtc-service/rtc.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  constructor(
    private rtc: RtcService
  ) {
  }
  ngOnInit(): void {}
}
