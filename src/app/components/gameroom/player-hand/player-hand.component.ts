import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'memer-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent implements OnInit {
  @Input() playerHand: string[];
  @Input() canVote: boolean;
  @Output() onCardSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectCard(card: string) {
    this.onCardSelect.emit(card);
  }
}
