import { Injectable } from '@angular/core';
import { Unit } from '../unit/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  getUnits() {
    console.log(units);
    return units;
  }

  addUnit(un) {
    units.push(un);
  }

  updateUnit(un) {
    var index = units.findIndex(u => u.target == un.target);
    units[index] = un;
    console.log(units);
  }
}

var units = [];
