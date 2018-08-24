import { Component } from '@angular/core';
import { ChatService } from '../shared/chat.service';
import { Unit } from '../unit/unit';
import { UnitsService } from '../shared/units.service';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {

  units: Array<Unit> = [];
  name;
  currentDrag;
  data = {
    target: '',
    name: '',
    clientX: '',
    clientY: ''
  }

  constructor(private chatService: ChatService, private unitService: UnitsService) {

    chatService.messages.subscribe(msg => {
      if (msg.type == 'unit-create') {
        this.addMessage(msg);
        this.createUnit(msg);
      } else if (msg.type == 'unit-click') {
        console.log('info about unit:' + msg);
      } else if (msg.type == 'hello') {
        this.addMessage(msg);
      } else if (msg.type == 'unit-drop') {
        this.addMessage(msg);
        this.dropUnit(msg);
      }

    })
  }

  askName() {
    this.name = prompt('Как вас зовут?');
    if(!this.name) {
      this.sendHello();
      this.units = this.unitService.getUnits();
    }
  }

  sendToServer(message) {
    console.log(`New message ${message.type}`);
    this.chatService.messages.next(message);
  }

  onDbClick(e) {
    if(!this.name) {
      this.askName();
    }
    this.data.clientX = e.clientX;
    this.data.clientY = e.clientY;

    if(e.target.classList.contains('unit')) {
      this.data.target = e.target.id;
      var message = {
        type: 'unit-click',
        data: this.data
      }
      console.log('info about unit:');
      console.dir(message.data);
    } else {
      this.data.target = Date.now().toString();
      this.data.name = this.name;
      var message = {
        type: 'unit-create',
        data: this.data
      };
      this.createUnit(message);
    }
    this.sendToServer(message);
  }

  createUnit(message){
    let unit = document.createElement("div"),
        base = document.querySelector("#base");

    unit.classList.add("unit");
    unit.draggable = true;
    unit.textContent = this.name;
    unit.setAttribute('id', message.data.target);
    unit.style.top = message.data.clientY + 'px';
    unit.style.left = message.data.clientX + 'px';

    this.unitService.addUnit(new Unit(message.data.target, message.data.name, unit.style.left, unit.style.top));
    this.units = this.unitService.getUnits();

    let audio = <HTMLAudioElement>document.getElementById("audio-cr");
    audio.play();
  }

  addMessage(message) {
    var messageContainer = document.querySelector('#messages'),
        messageItem = document.createElement('li');

        if(message.type == 'unit-drop') {
          messageItem.textContent = `Player ${message.data.name} has moved a ${message.data.target} unit!`;
        } else if (message.type == 'hello') {
          messageItem.textContent = `hello from ${message.data.name}!`;
        } else if (message.type == 'unit-create') {
          messageItem.textContent = `Player ${message.data.name} has created the ${message.data.target} unit!`;
        } else if (message.type == 'drag-err') {
          messageItem.textContent = `sorry, you can move only your own unit!`;
        }
    messageContainer.appendChild(messageItem);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  sendHello() {
    var message = {
        type: 'hello',
        data: { name: this.name }
    };

    this.sendToServer(message);
  }

  canDrag(e) {
      return this.units.find(x => x.target == e).name == this.data.name;
  }

  dragstart(ev) {
    this.currentDrag = ev.target;
  }

  dragover(ev) {
    ev.preventDefault();
  }

  drop(ev) {
    if(!this.canDrag(this.currentDrag.id)) {
      let audio = <HTMLAudioElement>document.getElementById("audio-er");
      let message = {
        type: 'drag-err'
      };
      this.addMessage(message);
      audio.play();
      return;
    }
    let audio = <HTMLAudioElement>document.getElementById("audio-drag");
    audio.play();

    ev.preventDefault();
    this.currentDrag.style.top = ev.clientY + 'px';
    this.currentDrag.style.left = ev.clientX + 'px';

    this.data.target = this.currentDrag.id;
    this.data.clientX = ev.clientX;
    this.data.clientY = ev.clientY;

    var message = {
      type: 'unit-drop',
      data: this.data
    }

    this.unitService.updateUnit(new Unit(message.data.target, message.data.name, this.currentDrag.style.left, this.currentDrag.style.top));
    this.sendToServer(message);
  }

  dropUnit(message) {
    var unit = document.getElementById(message.data.target);
    unit.style.top = message.data.clientY + 'px';
    unit.style.left = message.data.clientX + 'px';
  }

}
