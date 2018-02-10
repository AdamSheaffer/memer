import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router/';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'memer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;
  get isLightTheme() { return this.themeService.theme === Theme.LIGHT };

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService) {
    this.username = this.authService.getUser().username;
  }

  ngOnInit() {
  }

  changeTheme() {
    this.themeService.changeTheme();
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['login']));
  }
}
