import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../../interfaces';

@Component({
  selector: 'memer-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent implements OnInit {
  @Input() playerHand: Card[];
  @Input() playerCanSelect: boolean;
  @Output() cardSelect = new EventEmitter<Card>();

  constructor() { }

  ngOnInit() {
  }

  selectCard(card: Card) {
    if (!this.playerCanSelect) { return; }
    this.cardSelect.emit(card);
  }
}
