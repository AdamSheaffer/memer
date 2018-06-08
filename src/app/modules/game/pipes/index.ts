import { ActivePlayersPipe } from './active-player.pipe';
import { CurrentUserPipe } from './current-user.pipe';
import { ShufflePipe } from './shuffle.pipe';

export const PIPES = [
  ActivePlayersPipe,
  CurrentUserPipe,
  ShufflePipe
];

export * from './active-player.pipe';
export * from './current-user.pipe';
export * from './shuffle.pipe';
