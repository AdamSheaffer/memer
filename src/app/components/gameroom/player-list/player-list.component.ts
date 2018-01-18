import { Component, OnInit, Input } from '@angular/core';
import { IPlayer } from '../../../interfaces/IPlayer';

@Component({
  selector: 'memer-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  @Input() players: IPlayer[];

  constructor() { }

  ngOnInit() {
  }

}
