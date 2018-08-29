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

  deleteUnit(id) {
    let delId = [id];
      for (var i = 0; i < units.length; i++) {
          var unit = units[i];

          if (delId.indexOf(unit.target) !== -1) {
              units.splice(i, 1);
              i--;
          }
      }
  }

  updateUnit(un) {
    var index = units.findIndex(u => u.target == un.target);
    units[index] = un;
    console.log(units);
  }
}

var units = [];
