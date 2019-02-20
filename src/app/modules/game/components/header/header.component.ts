import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router/';
import { Theme, UserService, ThemeService } from '../../../core/services';

@Component({
  selector: 'memer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;
  get isLightTheme() { return this.themeService.theme === Theme.LIGHT; }

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private themeService: ThemeService) {
    this.username = this.userService.getPlayer().username;
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      const isDarkTheme = p.dark === 'true';
      if (isDarkTheme) { this.themeService.setDark(); }
    });
  }

  changeTheme() {
    this.themeService.changeTheme();
    const url = this
      .router
      .createUrlTree([{ dark: !this.isLightTheme }], { relativeTo: this.route })
      .toString();
    this.location.go(url);
  }

  logout() {
    this.userService.logout().then(() => this.router.navigate(['login']));
  }
}
