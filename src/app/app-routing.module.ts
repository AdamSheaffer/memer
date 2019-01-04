import { NgModule } from '@angular/core/';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent, HomeComponent, LoginComponent } from './components';
import { AuthGuard, NotAuthGuard, AdminGuard } from './guards';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
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
