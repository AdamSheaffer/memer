import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'memer-player-score',
  templateUrl: './player-score.component.html',
  styleUrls: ['./player-score.component.scss']
})
export class PlayerScoreComponent implements OnInit {
  @Input() score;

  constructor() { }

  ngOnInit() {
  }

}
