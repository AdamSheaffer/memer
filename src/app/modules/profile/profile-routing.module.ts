import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components';
import { ProfileGuard } from '../../guards';

const routes: Routes = [
  { path: ':id', component: ProfileComponent, canActivate: [ProfileGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProfileGuard]
})
export class ProfileRoutingModule { }
