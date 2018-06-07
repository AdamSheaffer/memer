import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../../../../interfaces';
import { ThemeService, Theme } from '../../../../core/services';

@Component({
  selector: 'memer-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  @Input() players: Player[];
  @Input() turn: string;
  @Input() isHost: boolean;
  @Input() hostId: string;
  @Output() playerRemoval = new EventEmitter<Player>();
  get isDarkTheme() { return this.themeService.theme === Theme.DARK; }

  playerStagedForRemoval: Player;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
  }

  stagePlayerToRemove(player: Player) {
    if (!this.isHost) { return; }

    this.playerStagedForRemoval = player;
  }

  removePlayer() {
    if (!this.isHost) { return; }

    this.playerRemoval.emit(this.playerStagedForRemoval);
    this.playerStagedForRemoval = null;
  }

}
