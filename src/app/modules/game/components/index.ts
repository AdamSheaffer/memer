import { ChatComponent } from './chat/chat.component';
import { MemeComponent } from './meme/meme.component';
import { PlayerScoreComponent } from './player-score/player-score.component';
import { HeaderComponent } from './header/header.component';
import { GAMEROOM_COMPONENTS } from './gameroom';

export const COMPONENTS = [
  ChatComponent,
  MemeComponent,
  PlayerScoreComponent,
  HeaderComponent,
  ...GAMEROOM_COMPONENTS
];

export * from './chat/chat.component';
export * from './meme/meme.component';
export * from './player-score/player-score.component';
export * from './gameroom';
