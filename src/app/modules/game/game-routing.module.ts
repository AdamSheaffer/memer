import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameroomComponent } from './components/gameroom';
import { GameGuard } from '../../guards';

const routes: Routes = [
  { path: ':id', component: GameroomComponent, canActivate: [GameGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [GameGuard],
  exports: [RouterModule]
})
export class GameRoutingModule { }
