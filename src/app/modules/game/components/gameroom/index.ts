import { GameroomComponent } from './gameroom.component';
import { GifOptionsComponent } from './gif-options/gif-options.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { TagSelectionComponent } from './tag-selection/tag-selection.component';
import { GiphySearchComponent } from './giphy-search/giphy-search.component';

export const GAMEROOM_COMPONENTS = [
  GameroomComponent,
  GifOptionsComponent,
  PlayerHandComponent,
  PlayerListComponent,
  TagSelectionComponent,
  GiphySearchComponent
];

export * from './gameroom.component';
export * from './gif-options/gif-options.component';
export * from './player-hand/player-hand.component';
export * from './player-list/player-list.component';
export * from './tag-selection/tag-selection.component';
export * from './giphy-search/giphy-search.component';
