import { Component } from '@angular/core';

@Component({
  selector: 'unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent {
  target: string;
  clientX: string;
  clientY: string

  constructor() { }
}
