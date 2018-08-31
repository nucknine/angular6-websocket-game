import { Injectable } from '@angular/core';
import { Unit } from '../unit/unit';

@Injectable()
export class UnitsService {

  getUnits(): Array<Unit> {
    console.log(this.units);
    return this.units;
  }

  addUnit(un): void {
    this.units.push(un);
  }

  deleteOne(): void {
    this.units.splice(0, 1);
  }

  deleteUnit(id): void {
    let delId = [id];
      for (var i = 0; i < this.units.length; i++) {
          var unit = this.units[i];

          if (delId.indexOf(unit.target) !== -1) {
              this.units.splice(i, 1);
              i--;
          }
      }
  }

  updateUnit(un): void {
    var index = this.units.findIndex(u => u.target == un.target);
    this.units[index] = un;
  }

  checkLimit(name): number {
    return this.units.filter(x => x.name == name).length;
  }

  units = [];
}

