import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/chat.service';
import { Player } from './player';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {
  players: Array<Player> = [];
  currentName: string;
  currentUnits: number = 1;

  constructor(private chatService: ChatService) {

    chatService.messages.subscribe(msg => {
      if (msg.type == 'unit-create') {
        console.log(msg);
        this.updateStats(msg);
      }
    })
  }

  ngOnInit() {
  }

  updateStats(message) {
    this.currentName = message.data.name;
    if (!this.players.find(x => x.name == this.currentName)) {
      this.players.push(new Player(this.currentName, this.currentUnits));
    } else {
      this.players.find(x => x.name == this.currentName).units += this.currentUnits;
    }
  }
}
