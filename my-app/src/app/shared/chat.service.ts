import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { environment } from '../../environments/environment';
import { Unit } from '../unit/unit';


export interface Message {
  type: string,
  data: {
    target?: string,
    name?: string,
    clientX?: string,
    clientY?: string,
    deletedName?: string,
    points?: number,
    units?: Array<Unit>
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
      .pipe(map((response: MessageEvent)  => {
        let data = JSON.parse(response.data);
        return data
      }))
  }
}
