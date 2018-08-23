import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { environment } from '../environments/environment';


export interface Message {
  type: string,
  data: {
    target?: string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: Subject<Message>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService
      .connect(environment.WS_URL)
      .pipe(map((response: MessageEvent): Message  => {
        let data = JSON.parse(response.data);
        return {
          type: data.type,
          data: data.data
        }
      }))
  }
}
