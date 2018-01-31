import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPlayer } from '../../../interfaces/IPlayer';

@Component({
  selector: 'memer-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  @Input() players: IPlayer[];
  @Input() turn: string;
  @Input() isHost: boolean;
  @Output() onPlayerRemoval = new EventEmitter<IPlayer>();

  playerStagedForRemoval: IPlayer;

  constructor() { }

  ngOnInit() {
  }

  stagePlayerToRemove(player: IPlayer) {
    if (!this.isHost) return;

    this.playerStagedForRemoval = player;
  }

  removePlayer() {
    if (!this.isHost) return;

    this.onPlayerRemoval.emit(this.playerStagedForRemoval);
    this.playerStagedForRemoval = null;
  }

}
