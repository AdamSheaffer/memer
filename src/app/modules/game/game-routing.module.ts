import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameroomComponent } from './components/gameroom';

const routes: Routes = [
  { path: ':id', component: GameroomComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
