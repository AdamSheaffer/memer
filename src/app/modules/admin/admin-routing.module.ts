import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeckManagerComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: 'DeckManager' },
  { path: 'DeckManager', component: DeckManagerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
