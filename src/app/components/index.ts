import { GameSetupComponent } from './game-setup/game-setup.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OnlinePlayerCountComponent } from './online-player-count/online-player-count.component';

export const APP_COMPONENTS = [
  GameSetupComponent,
  HomeComponent,
  LoginComponent,
  NotFoundComponent,
  OnlinePlayerCountComponent
];

export * from './game-setup/game-setup.component';
export * from './home/home.component';
export * from './login/login.component';
export * from './not-found/not-found.component';
export * from './online-player-count/online-player-count.component';
