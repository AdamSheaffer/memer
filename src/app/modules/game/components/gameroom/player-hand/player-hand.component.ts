import { Component, OnInit, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
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

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  selectCard(card: Card, cardBlockEl: any) {
    if (!this.playerCanSelect) { return; }

    const cardEl = cardBlockEl.parentElement;

    this.animateCardSelect(cardEl);

    cardEl.addEventListener('webkitAnimationEnd', () => {
      this.cardSelect.emit(card);
    });

    cardEl.addEventListener('animationend', () => {
      this.cardSelect.emit(card);
    });
  }

  private animateCardSelect(cardEl: any) {
    this.renderer.addClass(cardEl, 'zoomOutUp');
  }
}
