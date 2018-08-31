import { Injectable } from '@angular/core';
import { Unit } from '../unit/unit';

@Injectable()
export class UnitsService {

  getUnits() {
    console.log(this.units);
    return this.units;
  }

  addUnit(un) {
    this.units.push(un);
  }

  deleteOne(){
    this.units.splice(0, 1);
  }

  deleteUnit(id) {
    let delId = [id];
      for (var i = 0; i < this.units.length; i++) {
          var unit = this.units[i];

          if (delId.indexOf(unit.target) !== -1) {
              this.units.splice(i, 1);
              i--;
          }
      }
  }

  updateUnit(un) {
    var index = this.units.findIndex(u => u.target == un.target);
    this.units[index] = un;
  }

  checkLimit(name) {
    return this.units.filter(x => x.name == name).length;
  }

  units = [];
}

