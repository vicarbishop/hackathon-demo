import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatGPTService {

  constructor(private http: HttpClient) {

  }

  async communeWithTheAIGods(message:string): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(
       'https://api.openai.com/v1/chat/completions',
       {
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": message
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.SECRET_GPT_API}`
        }
      }
      ),
    );
  }
}
