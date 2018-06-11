import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeckManagerComponent, AdminHomeComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: AdminHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
