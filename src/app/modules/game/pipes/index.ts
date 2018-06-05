import { ActivePlayersPipe } from './active-player.pipe';
import { CurrentUserPipe } from './current-user.pipe';

export const PIPES = [
  ActivePlayersPipe,
  CurrentUserPipe
];

export * from './active-player.pipe';
export * from './current-user.pipe';
