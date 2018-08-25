import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../../../interfaces';

@Component({
  selector: 'memer-player-score',
  templateUrl: './player-score.component.html',
  styleUrls: ['./player-score.component.scss']
})
export class PlayerScoreComponent implements OnInit {
  @Input() player: Player;
  @Input() pointsToWin: number;

  hearts: number[] = [];

  constructor() { }

  ngOnInit() {
    this.hearts = Array(this.pointsToWin).fill(null);
  }

}
