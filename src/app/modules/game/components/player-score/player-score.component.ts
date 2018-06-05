import { Component, OnInit, Input } from '@angular/core';
import { IPlayer } from '../../../../interfaces';

@Component({
  selector: 'memer-player-score',
  templateUrl: './player-score.component.html',
  styleUrls: ['./player-score.component.scss']
})
export class PlayerScoreComponent implements OnInit {
  @Input() player: IPlayer;

  constructor() { }

  ngOnInit() {
  }

}
