import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  target: string;
  clientX: string;
  clientY: string

  constructor() { }

  ngOnInit() {
    console.log(this);
  }
  test() {
    console.log("hello");
  }
}
