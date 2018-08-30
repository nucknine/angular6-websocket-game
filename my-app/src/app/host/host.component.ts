import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/chat.service';
import { Player } from './player';
import { UnitsService } from '../shared/units.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent {
  units;
  players: Array<Player> = [];
  currentName: string;
  currentUnits: number = 1;

  constructor(private chatService: ChatService, private unitService: UnitsService) {

    chatService.messages.subscribe(msg => {
      this.units = this.unitService.getUnits();
      if (msg.type == 'unit-create') {
        this.addUnit(msg);
      } else if (msg.type == 'unit-delete'){
        this.removeUnit(msg);
      }
    })
  }

  addUnit(message) {
    if (!this.players.find(x => x.name == message.data.name)) {
      this.players.push(new Player(message.data.name, this.currentUnits));
    } else {
      this.players.find(x => x.name == message.data.name).units += 1;
    }
  }

  removeUnit(message) {
    console.log(message.data.points);
    this.players.find(x => x.name == message.data.deletedName).units -= 1;
    this.players.find(x => x.name == message.data.name).points = message.data.points;
  }

}
