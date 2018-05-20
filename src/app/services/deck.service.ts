import { Injectable } from '@angular/core';
import { cards } from '../data/cards';
import { ICard } from '../interfaces/ICard';
import { Observable } from 'rxjs';
import { shuffle } from 'lodash';
import { IPlayer } from '../interfaces/IPlayer';

@Injectable()
export class DeckService {
  private _url = '../assets/captions/captin-cards.json';

  constructor() { }

  getDeck(): ICard[] {
    return shuffle(cards);
  }

  // IS THERE A WAY TO DO THIS BETTER WITHOUT USING SIDE EFFECTS?
  deal(deck: ICard[], players: IPlayer[], numOfCards: number): void {
    players.forEach(p => {
      const cardsFromDeck = deck.splice(0, numOfCards);
      p.captions.push(...cardsFromDeck);
    });
  }

}
