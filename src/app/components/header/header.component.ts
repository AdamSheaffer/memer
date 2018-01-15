import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router/';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUser().displayName.split(' ')[0];
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['login']));
  }
}
