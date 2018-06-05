import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPlayer } from '../../../../../interfaces';
import { ThemeService, Theme } from '../../../../core/services';

@Component({
  selector: 'memer-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  @Input() players: IPlayer[];
  @Input() turn: string;
  @Input() isHost: boolean;
  @Input() hostId: string;
  @Output() playerRemoval = new EventEmitter<IPlayer>();
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  playerStagedForRemoval: IPlayer;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
  }

  stagePlayerToRemove(player: IPlayer) {
    if (!this.isHost) { return; }

    this.playerStagedForRemoval = player;
  }

  removePlayer() {
    if (!this.isHost) { return; }

    this.playerRemoval.emit(this.playerStagedForRemoval);
    this.playerStagedForRemoval = null;
  }

}
