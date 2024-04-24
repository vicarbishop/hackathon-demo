import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'hackathon';
  isProduction = environment.production;

  ngOnInit(): void {
    console.log('Is production: ', this.isProduction);
    console.log('Secret: ', environment.SECRET_GPT_API);
  }
}
