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
  text: string;
  name: string;
  points: number = 0;
  currentDrag: HTMLElement;
  started: boolean = false;
  data = {
    target: <string> null,
    name: <string> null,
    clientX: <string> null,
    clientY: <string> null,
    deletedName: <string> null,
    points: <number> 0,
    units: <Array<Unit>> null
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
      } else if (msg.type == 'unit-delete') {
        this.addMessage(msg);
        this.deleteUnit(msg);
      }

    })
  }

  // запрос имени игрока
  askName() {
    this.name = prompt('Как вас зовут?');
    if(this.name) {
      this.units = this.unitService.getUnits();
    } else {
      this.askName();
    }
  }

  // отправка данных websocket на сервер
  sendToServer(message) {
    console.log(`New message ${message.type}`);
    this.chatService.messages.next(message);
  }

  // обработка двойного нажатия по полю, либо прикосновения на touch-устройствах
  baseDbClick(e) {
    if(!this.name) {
      this.askName();
    }
    if (e.type == 'touchstart') {
      e = e.changedTouches[0];
    }
    if (e.target.id == 'create-btn') {
      this.data.clientX = this.getRandomCoords();
      this.data.clientY = this.getRandomCoords();
    } else {
      this.data.clientX = e.clientX - 60 + '';
      this.data.clientY = e.clientY - 80 + '';
    }
    if(e.target.classList.contains('unit')) {
      this.data.target = e.target.id;
      var message = {
        type: <string> 'unit-click',
        data: this.data
      }
      console.log('info about unit:');
      console.dir(message.data);
    } else {
      this.data.target = Date.now().toString();
      this.data.name = this.name;
      this.data.units = this.units;
      var message = {
        type: <string> 'unit-create',
        data: this.data
      };
      this.createUnit(message);
    }
    this.sendToServer(message);
  }

  // создание нового блока
  createUnit(message){
    console.log(message);
    this.unitService.addUnit(new Unit(message.data.target, message.data.name, message.data.clientX + 'px', message.data.clientY + 'px'));
    this.units = this.unitService.getUnits();

    let audio = <HTMLAudioElement>document.getElementById("audio-cr");
    audio.play();
  }

  // добавление лога поле информации
  addMessage(message) {
    var messageContainer = document.querySelector('#messages'),
        messageItem = document.createElement('li');

        if(message.type == 'unit-drop') {
          messageItem.textContent = `Player ${message.data.name} has moved a ${message.data.target} unit!`;
        } else if (message.type == 'hello') {
          if (message.data.text) {
            messageItem.textContent = `${message.data.name} said: ${message.data.text}`;
          }
        } else if (message.type == 'unit-create') {
          messageItem.textContent = `Player ${message.data.name} has created the ${message.data.target} unit!`;
        } else if (message.type == 'drag-err') {
          messageItem.textContent = `sorry, you can move only your own unit!`;
        } else if (message.type == 'unit-delete') {
          messageItem.textContent = `Player ${message.data.name} destroyed ${message.data.target} unit!`;
        }
    messageContainer.appendChild(messageItem);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // отправка сообщения в чат
  sendHello() {
    if(this.text && this.name) {
      var message = {
          type: <string> 'hello',
          data: {
            name: this.name,
            text: this.text
          }
      };
      this.addMessage(message);
      this.sendToServer(message);
    }
  }

  prevent(e) {
    e.preventDefault();
  }

  // проверка на возможность перетасивать блок
  canDrag(e) {
      return this.units.find(x => x.target == e).name == this.data.name;
  }

  dragstart(ev) {
    this.currentDrag = ev.target;
  }

  dragover(ev) {
    ev.preventDefault();
  }

  // обработка события drop или touchend для touch устройств
  drop(ev) {
    ev.preventDefault();
    let base = document.querySelector("#base");

    if (ev.type == 'touchend') {
      ev = ev.changedTouches[0];
      let touchTarget = document.elementFromPoint(ev.clientX, ev.clientY);
      if (touchTarget.classList.contains('unit')) {
        this.destroyUnit(touchTarget.id);
      }
    } else if (ev.target.classList.contains('unit')) {
      this.destroyUnit(ev.target.id);
    }

    if(!this.canDrag(this.currentDrag.id)) {
      let audio = <HTMLAudioElement>document.getElementById("audio-er");
      let message = {
        type: <string> 'drag-err'
      };
      this.addMessage(message);
      audio.play();
      return;
    }

    let audio = <HTMLAudioElement>document.getElementById("audio-drag");
    audio.play();

    // проверка левой/правой границы игрового поля
    if (base.clientHeight < ev.clientY + this.currentDrag.offsetHeight) {
      this.currentDrag.style.top = base.clientHeight - this.currentDrag.offsetHeight + 'px';
    } else if (ev.clientY < this.currentDrag.offsetHeight) {
      this.currentDrag.style.top = 0 + 'px';
    } else {
      this.currentDrag.style.top = ev.clientY - this.currentDrag.offsetHeight + 'px';
    }

    // проверка нижней/верхней границы игрового поля
    if (base.clientWidth < ev.clientX + this.currentDrag.offsetWidth) {
      this.currentDrag.style.left = base.clientWidth - this.currentDrag.offsetWidth + 'px';
    } else if (ev.clientX < this.currentDrag.offsetWidth) {
      this.currentDrag.style.left = 0 + 'px';
    } else {
      this.currentDrag.style.left = ev.clientX - this.currentDrag.offsetWidth + 'px';
    }

    this.data.target = this.currentDrag.id;
    this.data.clientX = this.currentDrag.style.left;
    this.data.clientY = this.currentDrag.style.top;

    var message = {
      type: <string> 'unit-drop',
      data: this.data
    }

    this.unitService.updateUnit(new Unit(this.currentDrag.id, this.name, this.currentDrag.style.left, this.currentDrag.style.top));
    this.units = this.unitService.getUnits();
    this.sendToServer(message);
  }

  // обработка события drop при получении сообщения от сервера
  dropUnit(message) {
    this.unitService.updateUnit(new Unit(message.data.target, message.data.name, message.data.clientX, message.data.clientY));
    this.units = this.unitService.getUnits();
  }

  // удаление определенного блока
  destroyUnit(id) {
    let unit = this.units.find(x => x.target == id);

    if(unit.name !== this.name) {
      this.data.target = unit.target;
      this.data.deletedName = this.units.find(x => x.target == unit.target).name;
      this.data.points = ++this.points;

      var message = {
        type: <string> 'unit-delete',
        data: this.data
      }
      this.unitService.deleteUnit(unit.target);
      this.units = this.unitService.getUnits();

      let audio = <HTMLAudioElement>document.getElementById("audio-destroy");
      audio.play();

      this.sendToServer(message);
    }
  }

  // обработка события "удаление определенного блока" при получении сообщения от сервера
  deleteUnit(message) {
    this.unitService.deleteUnit(message.data.target);
    this.units = this.unitService.getUnits();
  }

  getRandomCoords() {
    let base = document.querySelector("#base");
    return Math.floor(Math.random()*(base.clientWidth - 80) + 1) + '';
  }
}
