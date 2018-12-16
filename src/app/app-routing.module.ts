import { NgModule } from '@angular/core/';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'game', loadChildren: './modules/game/game.module#GameModule', canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule', canActivate: [AdminGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    declarations: [],
    providers: [AuthGuard, NotAuthGuard, AdminGuard],
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
