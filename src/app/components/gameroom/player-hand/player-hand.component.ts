import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICard } from '../../../interfaces/ICard';

@Component({
  selector: 'memer-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent implements OnInit {
  @Input() playerHand: ICard[];
  @Input() playerCanSelect: boolean;
  @Output() onCardSelect = new EventEmitter<ICard>();

  constructor() { }

  ngOnInit() {
  }

  selectCard(card: ICard) {
    if (!this.playerCanSelect) return;
    this.onCardSelect.emit(card);
  }
}
