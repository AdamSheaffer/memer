import { Injectable } from '@angular/core';
import { Round, RoundType } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoundPickerService {
  private chanceOfSpecial = .2;

  private roundTypes: Round[] = [
    { roundType: RoundType.Standard, isSpecial: false },
    { roundType: RoundType.Reverse, isSpecial: true },
  ];

  get specialRounds() { return this.roundTypes.filter(t => t.isSpecial); }
  get standardRound() { return this.roundTypes.find(t => t.roundType === RoundType.Standard); }

  constructor() {
   }

   setChanceOfSpecialRound(chance: number) {
     this.chanceOfSpecial = chance;
   }

   getRound() {
    const rand = Math.random();
    const isSpecial = rand < this.chanceOfSpecial;
    if (isSpecial) {
      const numberOfSpecials = this.specialRounds.length;
      const randomIndex = Math.floor(Math.random() * numberOfSpecials);
      return this.specialRounds[randomIndex];
    }
    return this.standardRound;
   }
}
