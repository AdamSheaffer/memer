import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';
import { GameGuard } from './game.guard';
import { NotAuthGuard } from './not-auth.guard';

export const GUARDS = [
  AdminGuard,
  AuthGuard,
  GameGuard,
  NotAuthGuard
];

export * from './admin.guard';
export * from './auth.guard';
export * from './game.guard';
export * from './not-auth.guard';
